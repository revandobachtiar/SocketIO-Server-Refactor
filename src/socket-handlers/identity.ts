import { Socket, Server } from "socket.io";

export default function robotHandlers(
    socket: Socket,
    io: Server
): void {

    socket.on("disconnect", () => {
        const robotId = socket.data.robotId;

        console.log(`Robot-${robotId} disconnected`);
    });

}