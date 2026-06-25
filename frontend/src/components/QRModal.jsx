import QRCode from "react-qr-code";

function QRModal({ queue, onClose }) {
    if (!queue) return null;

    const joinUrl =
        `${window.location.origin}/join/${queue._id}`;

    async function handleCopy() {
        await navigator.clipboard.writeText(joinUrl);
        alert("Join link copied!");
    }


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-[400px] rounded-2xl bg-white p-6 shadow-2xl">

                <h2 className="text-2xl font-bold text-center">
                    {queue.name}
                </h2>

                <p className="mt-2 text-center text-gray-500">
                    Scan to join this queue
                </p>

                <div className="mt-6 flex justify-center">
                    <QRCode value={joinUrl} size={220} />
                </div>
                <button
                    onClick={handleCopy}
                    className="mt-6 w-full rounded-xl border border-slate-300 bg-white py-3 font-semibold text-slate-700 hover:bg-slate-100"
                >
                    Copy Join Link
                </button>

                <p className="mt-6 break-all text-center text-sm text-gray-500">
                    {joinUrl}
                </p>

                <button
                    onClick={onClose}
                    className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
                >
                    Close
                </button>

            </div>
        </div>
    );
}

export default QRModal;