import { createServer } from "node:http";
import { initSocket } from "./src/socket/socket.js";
import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import databaseConnection from "./src/config/db.config.js";
import cookieParser from "cookie-parser"
import router from "./src/routes/Admin.routes.js";
import queueRouter from "./src/routes/Queue.routes.js";
import queueEntryRouter from "./src/routes/QueueEntry.routes.js";
import path from "path";

dotenv.config();
const PORT = process.env.PORT || 8080;
const URI = process.env.MONGO_URI;

const app = express();
const server = createServer(app);

//extablish mongo db connction 
databaseConnection(URI);

app.get("/", (req, res) => {
    res.send("FlowQ backend is running");
});

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

//plugins
app.use(express.json());
app.use(express.urlencoded({
    extended: false,
}));

app.use(cookieParser());

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true
    })
);

//routes
app.use("/admin", router);
app.use("/queue", queueRouter);
app.use("/queueJoin", queueEntryRouter);

initSocket(server);

app.get("/test", (req, res) => {
    res.sendFile(path.join(process.cwd(), "test.html"));
});

server.listen(PORT, () => {
    console.log(`The server is running on PORT ${PORT}`);
});