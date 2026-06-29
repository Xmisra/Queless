import { Link } from "react-router-dom";

const features = [
  {
    title: "QR Code Queue Joining",
    description: "Let customers join from their phone without crowding the counter.",
  },
  {
    title: "Real-Time Updates",
    description: "Keep staff and customers aligned as queue status changes.",
  },
  {
    title: "Live Queue Tracking",
    description: "See who is waiting, who is next, and who is being served.",
  },
  {
    title: "Secure Admin Dashboard",
    description: "Manage queues from a focused dashboard built for daily operations.",
  },
  {
    title: "Analytics Dashboard",
    description: "Track totals, waiting customers, completed visits, and skipped entries.",
  },
];

const steps = [
  "Admin creates queue",
  "QR generated",
  "Customer scans",
  "Token generated",
  "Real-time updates",
];

const LandingPage = () => {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <header className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-sm font-bold text-white shadow-sm">
              FQ
            </div>
            <span className="text-base font-semibold">FlowQ</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login?demo=true"
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm shadow-emerald-500/20 transition hover:bg-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-300/30"
            >
              Try Demo
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15 focus:outline-none focus:ring-4 focus:ring-white/20"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-400/30"
            >
              Sign Up
            </Link>
          </div>
        </header>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-10 sm:px-6 sm:pb-20 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:pb-24 lg:pt-16">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-blue-100">
              FlowQ
            </div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Real-Time Queue Management Made Simple
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              FlowQ helps teams create digital queues, share QR join links, call customers in order, and keep everyone updated in real time.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/login?demo=true"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-sm shadow-emerald-500/20 transition hover:bg-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-300/30"
              >
                🚀 Try Demo
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-400/30"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15 focus:outline-none focus:ring-4 focus:ring-white/20"
              >
                Sign Up
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15 focus:outline-none focus:ring-4 focus:ring-white/20"
              >
                How It Works
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur">
            <div className="rounded-2xl bg-white p-4 text-slate-950 shadow-soft">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Live Queue</p>
                  <h2 className="mt-1 text-xl font-semibold tracking-tight">Main Counter</h2>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                  Active
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Waiting", "12"],
                  ["Called", "1"],
                  ["Completed", "48"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                    <p className="text-xs font-semibold text-slate-500">{label}</p>
                    <p className="mt-2 text-2xl font-semibold">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Now serving</p>
                <div className="mt-2 flex items-center justify-between gap-4">
                  <p className="text-lg font-semibold">Token 27</p>
                  <span className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-blue-700 ring-1 ring-blue-100">
                    Calling...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-blue-600">Features</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Everything needed to run a cleaner queue.</h2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-sm font-bold text-blue-700 ring-1 ring-blue-100">
                FQ
              </div>
              <h3 className="text-base font-semibold text-slate-950">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-blue-600">How It Works</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">From queue setup to live customer updates.</h2>
          </div>
          <div className="mt-8 grid gap-3 lg:grid-cols-5">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center gap-3 lg:block">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-600 text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <p className="mt-4 text-sm font-semibold text-slate-950">{step}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="text-lg font-semibold text-slate-300 lg:mt-4 lg:text-center">↓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-slate-950">FlowQ</p>
          <p>Built with MERN, Socket.IO, and MongoDB.</p>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
