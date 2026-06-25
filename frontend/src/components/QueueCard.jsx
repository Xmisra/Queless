const QueueCard = ({ queue, onManage, onShowQR }) => {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-slate-300">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">{queue.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{queue.location}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${queue.isActive ? "bg-emerald-50 text-emerald-700 ring-emerald-100" : "bg-slate-100 text-slate-600 ring-slate-200"}`}>
          {queue.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={onManage}
          className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Manage Queue
        </button>

        <button
          type="button"
          onClick={onShowQR}
          className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Show QR
        </button>
      </div>
    </article>
  );
};

export default QueueCard;
