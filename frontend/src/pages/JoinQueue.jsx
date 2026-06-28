import api from '../api/axios'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import socket from '../socket/Socket'


const JoinQueue = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: ""
  });
  const [tokenNumber, setTokenNumber] = useState(null);
  const { queueId } = useParams();
  const [customerStatus, setCustomerStatus] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (isJoining) return;

    setIsJoining(true);
    try {
      const response = await api.post(`/queueJoin/${queueId}/join`, formData);
      const token = response.data.tokenNumber;

      localStorage.setItem(
        `queue-${queueId}`,
        JSON.stringify({
          tokenNumber: token,
        })
      );

      setTokenNumber(token);

      await fetchPosition(token);
      socket.emit("join-queue", queueId);
    }
    catch (err) {
      toast.error(err.response?.data?.error || "Could not join queue");

    } finally {
      setIsJoining(false);
    }
  }
  async function fetchPosition(token) {
    try {
      const response = await api.get(
        `/queueJoin/${queueId}/position/${token}`
      );

      setCustomerStatus(response.data);
    } catch (err) {
      localStorage.removeItem(`queue-${queueId}`);

      setTokenNumber(null);
      setCustomerStatus(null);

      toast.error(
        err.response?.data?.error || "Could not load queue status"
      );
    }
  }
  useEffect(() => {
    try {
      const savedQueue = localStorage.getItem(`queue-${queueId}`);

      if (!savedQueue) return;

      const { tokenNumber } = JSON.parse(savedQueue);

      setTokenNumber(tokenNumber);
      fetchPosition(tokenNumber);

      socket.emit("join-queue", queueId);
    } catch {
      localStorage.removeItem(`queue-${queueId}`);
    }
  }, [queueId]);

  useEffect(() => {
    if (!tokenNumber) return;

    const refreshStatus = async () => {
      await fetchPosition(tokenNumber);
    };

    const handleCompleted = async () => {
      await fetchPosition(tokenNumber);

      localStorage.removeItem(`queue-${queueId}`);

      setTimeout(() => {
        setTokenNumber(null);
        setCustomerStatus(null);
      }, 4000);
    };

    const handleSkipped = async () => {
      await fetchPosition(tokenNumber);

      localStorage.removeItem(`queue-${queueId}`);

      setTimeout(() => {
        setTokenNumber(null);
        setCustomerStatus(null);
      }, 4000);
    };

    socket.on("customer-called", refreshStatus);
    socket.on("customer-completed", handleCompleted);
    socket.on("customer-skipped", handleSkipped);

    return () => {
      socket.off("customer-called", refreshStatus);
      socket.off("customer-completed", handleCompleted);
      socket.off("customer-skipped", handleSkipped);
    };
  }, [tokenNumber, queueId]);

  function renderCustomerStatus() {
    if (!customerStatus) {
      return (
        <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">
          Loading your queue position...
        </div>
      );
    }

    if (customerStatus.status === "Called") {
      return (
        <div className="rounded-3xl border border-blue-100 bg-blue-50 px-6 py-8 text-center ring-1 ring-blue-100">
          <p className="text-3xl font-semibold tracking-tight text-blue-800">It's Your Turn!</p>
          <p className="mt-3 text-sm font-medium text-blue-700">Please proceed to the service counter.</p>
        </div>
      );
    }

    if (customerStatus.status === "Completed") {
      return (
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50 px-6 py-8 text-center ring-1 ring-emerald-100">
          <p className="text-3xl font-semibold tracking-tight text-emerald-800">✅ Service Completed</p>
          <p className="mt-3 text-sm font-medium text-emerald-700">Thank you for visiting.</p>
        </div>
      );
    }

    if (customerStatus.status === "Skipped") {
      return (
        <div className="rounded-3xl border border-red-100 bg-red-50 px-6 py-8 text-center ring-1 ring-red-100">
          <p className="text-3xl font-semibold tracking-tight text-red-800">⚠ You Were Skipped</p>
          <p className="mt-3 text-sm font-medium text-red-700">Please contact the administrator.</p>
        </div>
      );
    }

    return (
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Status</p>
          <span className="mt-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 ring-1 ring-blue-100">
            {customerStatus.status}
          </span>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Position</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">{customerStatus.position}</p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Est. Wait</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">{customerStatus.estimatedWaitTime} mins</p>
        </div>
      </div>
    );
  }

  if (tokenNumber) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
        <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-soft">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl font-bold text-emerald-700 ring-1 ring-emerald-100">
            ✓
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Successfully Joined Queue</h1>
          <p className="mt-2 text-sm text-slate-500">Keep this screen open for live queue updates.</p>

          <div className="my-8 rounded-3xl bg-slate-950 px-6 py-8 text-white">
            <p className="text-sm font-medium text-slate-300">Token Number</p>
            <h2 className="mt-2 text-6xl font-semibold tracking-tight">{tokenNumber}</h2>
          </div>

          {renderCustomerStatus()}
        </section>
      </div>
    );
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-sm font-bold text-white shadow-sm">
            FQ
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Join Queue</h1>
          <p className="mt-2 text-sm text-slate-500">Enter your details to receive a live token.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isJoining}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-700">
              Phone
            </label>
            <input
              id="phone"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={isJoining}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
              placeholder="Your phone number"
            />
          </div>

          <button
            type="submit"
            disabled={isJoining}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
          >
            {isJoining ? "Joining..." : "Join Queue"}
          </button>
        </form>
      </section>
    </main>
  )
}

export default JoinQueue
