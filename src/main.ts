import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import registerHandlers from "./socket-handlers/index.ts";



const authorizedRobots = [
    {
        robotId: "TESTING-1",
        processorId: "4ac69a4a6eac51d6",
    },
    {
        robotId: "TESTING-2",
        processorId: "10000000abcd5678",
    },
];
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

    const { robotId, processorId } = socket.handshake.auth;

    if (!robotId) {

        console.log("robotId Not Found");
        socket.disconnect(true);
        return;
    }

    if (!processorId) {

        console.log("processorId Not Found");
        socket.disconnect(true);
        return;
    }

    const robot = authorizedRobots.find(r =>
        r.robotId === robotId &&
        r.processorId === processorId
    );

    if (!robot) {

        console.log("================================");
        console.log("Unauthorized Robot");
        console.log("Robot ID     :", robotId);
        console.log("Processor ID :", processorId);
        console.log("================================");

        socket.emit("AUTH_FAILED", {
            success: false,
            message: "Unauthorized Robot",
        });

        socket.disconnect(true);
        return;
    }

    socket.data.robotId = robotId;
    socket.data.processorId = processorId;

    socket.join(robotId);

    console.log(`Client Connected : ${robotId}`);

    registerHandlers(socket, io);
});


httpServer.listen(4000,"0.0.0.0",() => {
        console.log("Socket.IO Active, PORT : 4000");
    }
);
