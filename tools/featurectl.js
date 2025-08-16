#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO_ROOT = process.cwd();
const LOCK_PATH = path.join(REPO_ROOT, '.feature-lock.json');
const CONFIG_PATH = path.join(REPO_ROOT, 'tools', 'features.config.json');

// --- helpers ---
function run(cmd, opts = {}) {
  try { return execSync(cmd, { stdio: 'pipe', encoding: 'utf8', ...opts }).trim(); }
  catch (e) { const out = e.stdout?.toString() || e.message || ''; throw new Error(`Command failed: ${cmd}\n${out}`); }
}
function ensureGitRepo() { try { run('git rev-parse --is-inside-work-tree'); } catch { console.error('❌ Not a git repo.'); process.exit(1); } }
function posix(p) { return p.replace(/\\/g, '/').replace(/^\.\/+/, ''); }
function sanitizeFeature(name) { return name.toLowerCase().replace(/[^a-z0-9/_-]+/g, '-').replace(/^-+|-+$/g, ''); }
function writeLock(lock) {
  fs.writeFileSync(LOCK_PATH, JSON.stringify(lock, null, 2));
  const gi = path.join(REPO_ROOT, '.gitignore');
  const cur = fs.existsSync(gi) ? fs.readFileSync(gi, 'utf8') : '';
  if (!cur.includes('.feature-lock.json')) fs.writeFileSync(gi, `${cur.trim()}\n.feature-lock.json\n`);
}
function readLock() { return fs.existsSync(LOCK_PATH) ? JSON.parse(fs.readFileSync(LOCK_PATH, 'utf8')) : null; }
function currentBranch() { try { return run('git rev-parse --abbrev-ref HEAD'); } catch { return '(unknown)'; } }
function defaultBaseBranch() {
  try { const ref = run('git symbolic-ref refs/remotes/origin/HEAD'); return ref.split('/').pop(); } catch { return 'main'; }
}
function remoteHttpsUrl() {
  try {
    const url = run('git config --get remote.origin.url');
    if (url.startsWith('http')) return url.replace(/\.git$/, '');
    const m = url.match(/^git@([^:]+):(.+?)(\.git)?$/); if (m) return `https://${m[1]}/${m[2]}`;
  } catch {}
  return null;
}

if (!fs.existsSync(CONFIG_PATH)) { console.error('❌ Missing tools/features.config.json'); process.exit(1); }
const FEATURES = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

const ALWAYS_OK = [
  '^\\.husky/', '^tools/', '^\\.github/', '^README\\.md$', '^CHANGELOG\\.md$', '^package\\.json$',
  '^pnpm-lock\\.yaml$', '^package-lock\\.json$', '^yarn\\.lock$', '^\\.gitignore$'
];

function buildRegex(allowed) {
  const all = [...ALWAYS_OK, ...allowed.map(p => `^${p.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}/`)];
  return new RegExp(all.join('|'));
}
function listChanged(scope) {
  const s = (cmd) => run(cmd).split('\n').filter(Boolean);
  if (scope === 'staged') return s('git diff --name-only --cached');
  if (scope === 'working') return s('git ls-files -m -o --exclude-standard');
  return s('git diff --name-only');
}

// --- commands ---
function cmd_list() {
  console.log('Features:\n' + Object.entries(FEATURES)
    .map(([k, v]) => ` - ${k}  ->  ${v.paths.join(', ')}`).join('\n'));
}
function cmd_status() {
  ensureGitRepo();
  const br = currentBranch();
  const lock = readLock();
  console.log(`Branch: ${br}`);
  if (!lock) { console.log('Lock: ❌ none (run checkout)'); return; }
  console.log(`Lock: ✅ feature="${lock.feature}" extras="${(lock.extras||[]).join(',')}" branch="${lock.branch}"`);
  console.log('Allowed paths:\n- ' + lock.allowedPaths.join('\n- '));
}
function ensureLock() {
  const lock = readLock();
  if (!lock) { console.error('❌ Feature not checked out. Run: node tools/featurectl.js checkout <feature>'); process.exit(1); }
  const br = currentBranch();
  if (br !== lock.branch) { console.error(`❌ On branch "${br}" but lock is for "${lock.branch}".`); process.exit(1); }
  return lock;
}
function cmd_ensure() { ensureGitRepo(); ensureLock(); console.log('🔒 Feature lock OK.'); }

function cmd_checkout(featureRaw, ...restArgs) {
  ensureGitRepo();
  if (!featureRaw) { console.error('Usage: node tools/featurectl.js checkout <feature> [--with feat1,feat2]'); process.exit(1); }

  const withIdx = restArgs.indexOf('--with');
  const extras = withIdx >= 0 ? restArgs.slice(withIdx + 1).join(' ').split(',').map(s => s.trim()).filter(Boolean) : [];

  const feat = sanitizeFeature(featureRaw);
  const allFeat = [feat, ...extras];
  const missing = allFeat.filter(f => !FEATURES[f]);
  if (missing.length) { console.error(`❌ Unknown feature(s): ${missing.join(', ')}`); process.exit(1); }

  const unionPaths = [...new Set(allFeat.flatMap(f => FEATURES[f].paths).map(posix))];
  const branch = `feat/${feat}`;

  try { run(`git switch -c ${branch}`); } catch { run(`git switch ${branch}`); }
  try { run('git sparse-checkout init --cone'); } catch {}
  run(`git sparse-checkout set ${unionPaths.map(p => `"${p}"`).join(' ')}`);

  writeLock({ feature: feat, extras, branch, allowedPaths: unionPaths, createdAt: new Date().toISOString() });

  console.log('✅ Feature checked out & locked.');
  console.log(`   Branch: ${branch}`);
  console.log(`   Scope: ${[feat, ...extras].join(' + ')}`);
  console.log('   Allowed paths:\n   - ' + unionPaths.join('\n   - '));
}

function checkScope(kind) {
  const lock = ensureLock();
  const allowRe = buildRegex(lock.allowedPaths);
  const offenders = listChanged(kind).filter(f => !allowRe.test(f));
  if (offenders.length) {
    console.error('\n❌ Files outside feature scope:\n' + offenders.map(f => ' - ' + f).join('\n'));
    console.error('\nAllowed prefixes:\n' + lock.allowedPaths.map(p => ' - ' + p).join('\n'));
    process.exit(1);
  }
  console.log('✅ All changes are within allowed feature paths.');
  return lock;
}
function cmd_precommit() { checkScope('staged'); }
function cmd_check() { checkScope('working'); }

function cmd_checkin(args) {
  let message = null, autoRelease = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--release') autoRelease = true;
    if (args[i] === '-m' || args[i] === '--message') { message = args[i + 1]; i++; }
  }

  const lock = checkScope('working'); // validates scope
  // run project checks if present
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(REPO_ROOT,'package.json'), 'utf8'));
    if (pkg.scripts?.check) {
      const runner = fs.existsSync(path.join(REPO_ROOT,'pnpm-lock.yaml')) ? 'pnpm' :
                     fs.existsSync(path.join(REPO_ROOT,'yarn.lock')) ? 'yarn' : 'npm run';
      console.log('🧪 Running project checks…'); run(`${runner} check`, { stdio: 'inherit' });
    }
  } catch {}

  run('git add -A');
  const diff = run('git diff --cached --name-only');
  if (diff) {
    const msg = (message || `feat(${lock.feature}): update`).replace(/"/g,'\\"');
    run(`git commit -m "${msg}"`);
    console.log('✅ Committed.');
  } else {
    console.log('ℹ️ No staged changes.');
  }

  try { run(`git push -u origin ${lock.branch}`); console.log(`🚀 Pushed ${lock.branch}.`); }
  catch (e) { console.error('⚠️ Push failed.\n' + e.message); }

  const base = defaultBaseBranch();
  const https = remoteHttpsUrl();
  if (https) console.log(`🔗 Open PR: ${https}/compare/${base}...${encodeURIComponent(lock.branch)}?expand=1`);

  if (autoRelease) {
    try { run('git sparse-checkout set .'); console.log('📂 Workspace widened.'); } catch {}
    if (fs.existsSync(LOCK_PATH)) { fs.unlinkSync(LOCK_PATH); console.log('🔓 Removed .feature-lock.json'); }
  } else {
    console.log('✅ Check-in complete. (Add --release to widen & unlock.)');
  }
}

function main() {
  const [, , cmd, arg1, ...rest] = process.argv;
  switch (cmd) {
    case 'list': return cmd_list();
    case 'status': return cmd_status();
    case 'ensure': return cmd_ensure();
    case 'checkout': return cmd_checkout(arg1, ...rest);
    case 'precommit': return cmd_precommit();
    case 'check': return cmd_check();
    case 'checkin': return cmd_checkin([arg1, ...rest].filter(Boolean));
    case 'release':
      try { run('git sparse-checkout set .'); console.log('📂 Workspace widened.'); } catch {}
      if (fs.existsSync(LOCK_PATH)) { fs.unlinkSync(LOCK_PATH); console.log('🔓 Removed .feature-lock.json'); }
      return;
    default:
      console.log(`Usage:
  node tools/featurectl.js list
  node tools/featurectl.js checkout <feature> [--with feat1,feat2]
  node tools/featurectl.js status
  node tools/featurectl.js ensure
  node tools/featurectl.js precommit
  node tools/featurectl.js check
  node tools/featurectl.js checkin [-m "<message>"] [--release]
  node tools/featurectl.js release`);
      process.exit(1);
  }
}
ensureGitRepo();
main();
