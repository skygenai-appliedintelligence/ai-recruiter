import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-700">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/10 backdrop-blur-md shadow-sm">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8 text-white">
          {/* Left: Brand */}
          <Link href="/" className="text-lg font-semibold tracking-tight">
            AI Recruiter
          </Link>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-xl border border-white/80 px-4 py-2 text-sm font-medium text-white/90 shadow-sm transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              Login
            </Link>
            <Link
              href="/company/signup"
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-md transition hover:bg-emerald-50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              Company Signup
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-6">
        <section className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12 text-center">
          {/* Logo Badge */}
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-xl font-bold text-emerald-700 shadow">AI</div>

          {/* Headline */}
          <h1 className="mb-3 bg-gradient-to-r from-emerald-300 to-cyan-200 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">AI Recruiter</h1>
          <p className="mb-10 max-w-2xl text-lg leading-relaxed text-white/90">Intelligent recruitment solutions</p>

          {/* CTA Card */}
          <div className="mx-auto w-full max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-lg">
            <div className="mb-4 text-2xl font-bold text-gray-900">Welcome</div>
            <p className="mb-6 text-sm text-gray-600">Get started with AI Recruiter in minutes.</p>
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Link href="/company/signup" className="flex-1 rounded-xl bg-emerald-600 px-6 py-3 text-center text-base font-semibold text-white shadow-md transition hover:bg-emerald-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-300">Get Started</Link>
              <Link href="/login" className="flex-1 rounded-xl border border-gray-300 bg-white px-6 py-3 text-center text-base font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-300">Sign in</Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto grid max-w-5xl gap-6 pb-20 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">⚡</div>
            <h3 className="mb-2 text-base font-semibold text-gray-900">Smart Sourcing</h3>
            <p className="text-sm text-gray-600">Find top candidates faster with AI-assisted search and ranked matches.</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">🤖</div>
            <h3 className="mb-2 text-base font-semibold text-gray-900">Automated Screening</h3>
            <p className="text-sm text-gray-600">Screen applications automatically and focus on the best-fit profiles.</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm sm:col-span-2 lg:col-span-1">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">📅</div>
            <h3 className="mb-2 text-base font-semibold text-gray-900">One‑click Scheduling</h3>
            <p className="text-sm text-gray-600">Coordinate interviews effortlessly with calendar integrations.</p>
          </div>
        </section>

        {/* Learn More Anchor */}
        <section
          id="learn-more"
          className="mx-auto max-w-4xl pb-24 text-center text-sm text-gray-600"
        >
          <p>
            Discover how AI Recruiter streamlines sourcing, screening, and scheduling with intelligent automation.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/70 bg-white/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 text-sm text-gray-500 lg:px-8">
          <span>© {new Date().getFullYear()} AI Recruiter</span>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-gray-700">Login</Link>
            <Link href="/company/signup" className="hover:text-gray-700">Company Signup</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
