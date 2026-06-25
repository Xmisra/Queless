import api from '../api/axios'
import { useParams } from 'react-router-dom'
import { useState,useEffect } from 'react'


const JoinQueue = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: ""
  });
  const [tokenNumber, setTokenNumber] = useState(null);
  const { queueId } = useParams();
  const [customerStatus, setCustomerStatus] = useState(null);
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await api.post(`/queueJoin/${queueId}/join`, formData);
      const token = response.data.tokenNumber;

      setTokenNumber(token);

      await fetchPosition(token);
    }
    catch (err) {
      console.log(err.response?.data);

    }
  }
  async function fetchPosition(token) {
    try {
      const response = await api.get(
        `/queueJoin/${queueId}/position/${token}`
      );

      setCustomerStatus(response.data);
    }
    catch (err) {
      console.log(err.response?.data);
    }
  }
  useEffect(() => {
    if (!tokenNumber) return;

    const interval = setInterval(() => {
      fetchPosition(tokenNumber);
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenNumber]);
  
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

          {customerStatus ? (
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
          ) : (
            <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">
              Loading your queue position...
            </div>
          )}
        </section>
      </div>
    );
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-sm font-bold text-white shadow-sm">
            QL
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
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="Your phone number"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            Join Queue
          </button>
        </form>
      </section>
    </main>
  )
}

export default JoinQueue
