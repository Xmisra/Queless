import { Server } from "socket.io";

let io;

function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "*"
        }
    });

    io.on("connection", (socket) => {
        console.log("Client Connected!!", socket.id);

        socket.on("join-queue", (queueId) => {
            socket.join(queueId);

            console.log(
                `Socket ${socket.id} joined queue ${queueId}`
            );
        });

        socket.on("disconnect", () => {
            console.log("Client Disconnected!!!");
        });
    });
}

function getIO() {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }

    return io;
}

export { initSocket, getIO };