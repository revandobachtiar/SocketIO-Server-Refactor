import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import registerHandlers from "./socket-handlers/index.ts";

const app = express();
const httpServer = createServer(app);

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ready",
    });
});
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});
io.on("connection", (socket) => {
    console.log("====================");
    console.log("Socket ID :", socket.id);
    console.log("Auth      :", socket.handshake.auth);
    const { robotId } = socket.handshake.auth;

    if (!robotId) {
        console.log("robotId Not Found");
        socket.disconnect();
        return;
    }

    socket.data.robotId = robotId;
    socket.join(robotId);

    console.log(`Client Connected: ${robotId}`);

    registerHandlers(socket, io);
});


httpServer.listen(4000,"0.0.0.0",() => {
        console.log("Socket.IO Active, PORT : 4000");
    }
);
