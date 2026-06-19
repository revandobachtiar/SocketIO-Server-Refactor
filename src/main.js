import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import registerHandlers from "./socket-handlers/index.js";

const app = express();
const httpServer = createServer(app);

app.get("/health", (req, res) => { res.status(200).json({ status: "ready" }); });

const io = new Server(httpServer, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {

  const { userId } = socket.handshake.auth;

  console.log("Client connected:", userId);

  socket.join(userId);

  // socket.onAny((eventName, ...args) => {
  //   console.log("Event masuk:", eventName);
  //   console.log("Data:", args);
  //   console.log("Dari socket:", socket.id);
  // });

  registerHandlers(socket, io);
})

httpServer.listen(4000, "0.0.0.0",() => 
  console.log(" Socket.IO server aktif di port 4000")
);
