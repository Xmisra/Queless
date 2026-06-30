import { Server } from "socket.io";

let io;

function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    io.on("connection", (socket) => {
        console.log("Client Connected:", socket.id);

        socket.on("join-queue", (queueId) => {
            socket.join(queueId);

            console.log(`${socket.id} joined room ${queueId}`);

            console.log("Rooms of socket:", [...socket.rooms]);
        });

        socket.on("disconnect", () => {
            console.log("Client Disconnected:", socket.id);
        });
    });
}

function getIO() {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
}

export { initSocket, getIO };