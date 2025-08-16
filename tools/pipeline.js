#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { spawnSync, execSync } = require('child_process');

const ROOT = process.cwd();
const LOCK_PATH = path.join(ROOT, '.feature-lock.json');
const CFG_PATH  = path.join(ROOT, 'tools', 'features.config.json');
const ART_DIR   = path.join(ROOT, 'artifacts');

function run(cmd, opts={}) {
  const [bin, ...args] = cmd.split(' ');
  const res = spawnSync(bin, args, { stdio: 'inherit', shell: true, ...opts });
  if (res.status !== 0) process.exit(res.status ?? 1);
}
function out(cmd) { return execSync(cmd, { encoding: 'utf8' }).trim(); }
function nowSlug() { return new Date().toISOString().replace(/[:.]/g,'-'); }
function ensureGit() { try{ out('git rev-parse --is-inside-work-tree'); } catch{ console.error('❌ Not a git repo'); process.exit(1); } }
function readLock() { return fs.existsSync(LOCK_PATH) ? JSON.parse(fs.readFileSync(LOCK_PATH,'utf8')) : null; }
function readCfg() { if (!fs.existsSync(CFG_PATH)) { console.error('❌ Missing tools/features.config.json'); process.exit(1); } return JSON.parse(fs.readFileSync(CFG_PATH,'utf8')); }
function branch() { try { return out('git rev-parse --abbrev-ref HEAD'); } catch { return '(unknown)'; } }

function ensurePlaywrightInstalled() {
  const has = fs.existsSync(path.join(ROOT, 'node_modules', '@playwright', 'test'));
  if (!has) {
    console.log('📦 Installing @playwright/test …');
    run('pnpm add -D @playwright/test');
    run('pnpm exec playwright install');
  }
}
function ensurePlaywrightConfig() {
  const cfg = path.join(ROOT, 'playwright.config.ts');
  if (!fs.existsSync(cfg)) {
    fs.writeFileSync(cfg, `
import { defineConfig } from '@playwright/test';
export default defineConfig({
  timeout: 30000,
  retries: 0,
  use: { baseURL: process.env.BASE_URL || 'http://localhost:3000' },
  reporter: [['list'], ['junit', { outputFile: 'artifacts/_junit.xml' }], ['html', { open: 'never' }]],
});
`.trimStart());
    console.log('📝 Created playwright.config.ts');
  }
}
function generateSmokeTests(envName) {
  const genDir = path.join(ROOT, 'tests', 'generated');
  fs.mkdirSync(genDir, { recursive: true });
  const cfg = readCfg();
  const routes = Object.entries(cfg).flatMap(([k,v]) => (v.routes||[]).map(r => ({ feature: k, route: r })));
  const body = `
import { test, expect } from '@playwright/test';
const routes = ${JSON.stringify(routes, null, 2)};
for (const r of routes) {
  test(\`${envName} smoke: \${r.feature} \${r.route}\`, async ({ page }) => {
    await page.goto(r.route);
    await expect(page).toHaveURL(new RegExp(r.route.replace(/\\//g,'\\\\/')));
  });
}
`.trimStart();
  const file = path.join(genDir, `smoke.${envName}.spec.ts`);
  fs.writeFileSync(file, body);
  return file;
}
function runChecks() {
  const pkgPath = path.join(ROOT, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath,'utf8'));
    if (pkg.scripts?.check) { console.log('🧪 Running project checks (pnpm check)…'); run('pnpm -s check'); }
    else { console.log('ℹ️ No "check" script; skipping lint/unit/typecheck.'); }
  }
}
function moveIfExists(src, dest) {
  if (fs.existsSync(src)) { fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.renameSync(src, dest); }
}
function runE2E(envName, baseUrl) {
  ensurePlaywrightInstalled();
  ensurePlaywrightConfig();
  fs.mkdirSync(ART_DIR, { recursive: true });

  const spec = generateSmokeTests(envName);
  const ts = nowSlug();
  const outDir = path.join(ART_DIR, envName, ts);
  fs.mkdirSync(outDir, { recursive: true });

  console.log(`🌐 E2E (${envName}) BASE_URL=${baseUrl || '(default)'}`);
  run(`pnpm exec playwright test ${spec}`, { env: { ...process.env, BASE_URL: baseUrl || process.env.BASE_URL } });

  moveIfExists(path.join(ROOT, 'playwright-report'), path.join(outDir, 'playwright-report'));
  moveIfExists(path.join(ROOT, 'artifacts', '_junit.xml'), path.join(outDir, 'junit.xml'));
  fs.writeFileSync(path.join(outDir, 'summary.json'),
    JSON.stringify({ env: envName, baseUrl: baseUrl || null, when: new Date().toISOString() }, null, 2));
  console.log(`📦 Saved reports to ${outDir}`);
}
function mergePush(from, to) {
  run('git fetch origin');
  try { out(`git rev-parse --verify origin/${to}`); }
  catch { run(`git branch -f ${to} origin/${from}`); run(`git push -u origin ${to}`); return; }
  run(`git switch ${to} || git switch -c ${to} origin/${to}`);
  run(`git merge --no-ff origin/${from} -m "chore(ci): promote ${from} -> ${to}"`);
  run(`git push origin ${to}`);
}

// --- CLI ---
ensureGit();
const action = (process.argv[2] || '').toLowerCase();

switch (action) {
  case 'checkout_feature': {
    const args = process.argv.slice(3); // <feature> [--with shared,other]
    if (!args.length) { console.log('Usage: pnpm Checkout_Feature <feature> [-- --with shared,other]'); process.exit(1); }
    run(`node tools/featurectl.js checkout ${args.map(a => `"${a}"`).join(' ')}`);
    break;
  }
  case 'test_feature': {
    if (!readLock()) { console.error('❌ No lock. Run Checkout_Feature first.'); process.exit(1); }
    runChecks();
    runE2E('dev', process.env.DEV_BASE_URL);
    console.log('✅ Feature tests done.');
    break;
  }
  case 'checkin_feature': {
    // capture lock BEFORE releasing
    const before = readLock();
    const msgIdx = process.argv.indexOf('-m');
    const msg = msgIdx > -1 ? process.argv.slice(msgIdx + 1).join(' ').replace(/^"|"$/g,'') : null;

    run('pnpm -s Test_Feature'); // ensure green
    const quoted = msg ? `-m "${msg.replace(/"/g,'\\"')}"` : '';
    run(`node tools/featurectl.js checkin ${quoted} --release`);

    const sourceBranch = before?.branch || branch();
    console.log('🚀 Promoting feature to DEV…');
    mergePush(sourceBranch, 'dev'); // dev updated
    break;
  }
  case 'testall_features': {
    runChecks();
    runE2E('dev', process.env.DEV_BASE_URL);
    break;
  }
  case 'pushcode_to_uat': {
    console.log('⬆️  Promote DEV -> UAT');
    mergePush('dev', 'uat'); break;
  }
  case 'testall_features_uat': {
    runE2E('uat', process.env.UAT_BASE_URL); break;
  }
  case 'pushcode_to_prod': {
    console.log('⬆️  Promote UAT -> PROD (main)');
    mergePush('uat', 'main'); break;
  }
  case 'testall_features_prod': {
    runE2E('prod', process.env.PROD_BASE_URL); break;
  }
  default:
    console.log(`Usage:
  pnpm Checkout_Feature <feature> [-- --with shared,other]
  pnpm Test_Feature
  pnpm Checkin_Feature [-m "message"]
  pnpm TestAll_Features
  pnpm PushCodeTo_UAT
  pnpm TestAll_Features_UAT
  pnpm PushCodeTo_PROD
  pnpm TestAll_Features_PROD`);
    process.exit(1);
}
