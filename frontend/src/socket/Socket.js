import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL, {
    withCredentials: true,
    transports: ["websocket", "polling"],
});

socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
});

socket.on("connect_error", (err) => {
    console.log("Socket connect error:", err.message);
});

export default socket;