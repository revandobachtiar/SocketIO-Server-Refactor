import { Socket, Server } from "socket.io";
import { z } from "zod";


const volumeset = z.object({})
const volumesetrequest = z.object({})

const eventSchemas = {
    VOLUME_SET: volumeset,
    VOLUME_SET_REQUEST: volumesetrequest
}

export default function volumeHandler(
    socket: Socket,
    io: Server
): void {
     Object.entries(eventSchemas). forEach(
                ([eventName, schema]) => {
                    socket.on(eventName, (msg: unknown, ack?: Function) => {
                        const result = schema.safeParse(msg);
                        if (!result.success) {
                            console.error(`[${eventName}] Validation Failed`);
                            if (ack) {
                                ack({
                                    status: "error",
                                    event: eventName,
                                    message: "Validation failed",
                                    errors: result.error.flatten(),
                                });
                            }
                            return;
                        }
                        const robotId = socket.data.robotId;
                        const payload = {
                            ...result.data,
                        };
                        console.log(`${eventName} from: ${robotId}`);
                        io.to(robotId).emit(eventName, payload);
                        console.log(`${eventName} emitted`, payload);
                        if (ack) {
                            ack({
                                status: "ok",
                                event: eventName,
                                robotId,
                            });
                        }
        
                    })
                }
            )
}
// export default function volumeHandlers(socket, io) {
//     //VOLUME
//     socket.on("VOLUME_SET", (msg) => {
//         console.log("VOLUME_SET:", msg, "from:", socket.userId);
//         io.emit("VOLUME_SET", msg);
//     });

//     socket.on("VOLUME_SET_REQUEST", (msg) => {
//         console.log("VOLUME_SET_REQUEST:", msg, "from:", socket.userId);
//         io.emit("VOLUME_SET_REQUEST", msg);
//     })    
// }