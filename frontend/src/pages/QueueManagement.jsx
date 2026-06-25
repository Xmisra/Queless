import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';


const QueueManagement = () => {

  const { queueId } = useParams();
  const [queue, setQueue] = useState(null);
  const [stats, setStats] = useState(null);

  async function fetchQueue() {
    try {
      const response = await api.get(`/queue/${queueId}`);
      setQueue(response.data.queue);
    }
    catch (err) {
      console.log(err);

    }
  }
  async function handleCallNext() {
    try {
      const response = await api.post(`/queueJoin/${queueId}/call_next`);
      console.log(response.data);
      await fetchStats();

    }
    catch (err) {
      console.log(err.response?.data);

    }
  }
  async function handleComplete() {
    try {
      const response = await api.post(
        `/queueJoin/${queueId}/completed`
      );

      console.log(response.data);

      await fetchStats();
    }
    catch (err) {
      console.log(err.response?.data);
    }
  }

  async function handleSkip() {
    try {
      const response = await api.post(
        `/queueJoin/${queueId}/skipped`
      );

      console.log(response.data);

      await fetchStats();
    }
    catch (err) {
      console.log(err.response?.data);
    }
  }
  async function fetchStats() {
    try {
      const response = await api.get(
        `/queueJoin/${queueId}/stats`
      );

      setStats(response.data);
    }
    catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchQueue();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!queue) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar title="QueueLess" subtitle="Queue management" />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
            <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />
            <div className="mt-4 h-10 w-64 animate-pulse rounded bg-slate-100" />
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />
              <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />
              <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar title="QueueLess" subtitle="Queue management" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${queue.isActive ? "bg-emerald-50 text-emerald-700 ring-emerald-100" : "bg-slate-100 text-slate-600 ring-slate-200"}`}>
                  {queue.isActive ? "Active" : "Inactive"}
                </span>
                <span className="text-sm text-slate-500">{queue.location}</span>
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{queue.name}</h1>
              <p className="mt-2 text-sm text-slate-500">Monitor the live queue and move customers through the service flow.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
              <button
                type="button"
                onClick={handleCallNext}
                className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                Call Next
              </button>
              <button
                type="button"
                onClick={handleComplete}
                className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100"
              >
                Complete
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className="rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-100"
              >
                Skip
              </button>
            </div>
          </div>
        </section>

        {stats ? (
          <>
            <section className="mb-6 grid gap-4 md:grid-cols-3">
              <StatsCard label="Waiting Customers" value={stats.totalWaiting} tone="blue" />
              <StatsCard label="Completed Customers" value={stats.totalCompleted} tone="green" />
              <StatsCard label="Skipped Customers" value={stats.totalSkipped} tone="red" />
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-950">Current Customer</h2>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-100">
                    Now serving
                  </span>
                </div>
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Name</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950">{stats.currentCustomer?.name || "None"}</p>
                  <p className="mt-5 text-sm text-slate-500">Token</p>
                  <p className="mt-1 text-lg font-semibold text-slate-700">{stats.currentCustomer?.tokenNumber || "-"}</p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-950">Next Customer</h2>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                    Up next
                  </span>
                </div>
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Name</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950">{stats.nextCustomer?.name || "None"}</p>
                  <p className="mt-5 text-sm text-slate-500">Token</p>
                  <p className="mt-1 text-lg font-semibold text-slate-700">{stats.nextCustomer?.tokenNumber || "-"}</p>
                </div>
              </div>
            </section>
          </>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-soft">
            <div className="mx-auto mb-4 h-10 w-10 animate-pulse rounded-full bg-slate-100" />
            <h2 className="text-lg font-semibold text-slate-950">Loading queue statistics</h2>
            <p className="mt-2 text-sm text-slate-500">Live queue data will appear here shortly.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default QueueManagement
