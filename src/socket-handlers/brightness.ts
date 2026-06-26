import { Socket, Server } from "socket.io";
import { z } from "zod";


const screenbrightnessset = z.object({})
const screenbrightnessrequest = z.object({})

export type ScreenBrightnessSet = 
    z.infer<typeof screenbrightnessset>;
export type ScreenBrightnessRequest =
    z.infer<typeof screenbrightnessrequest>;

const eventSchemas = {
    SCREEN_BRIGHTNESS_SET: screenbrightnessrequest,
    SCREEN_BRIGHTNESS_REQUEST: screenbrightnessset
}

export default function brightnessModuleHandler(
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



// export default function brightnessHandlers(socket, io) {
//     //BRIGHTNESS
//     socket.on("SCREEN_BRIGHTNESS_SET", (msg) => {
//         console.log("SCREEN_BRIGHTNESS_SET:", msg);
//         io.emit("SCREEN_BRIGHTNESS_SET", msg);
//     });

//     socket.on("SCREEN_BRIGHTNESS_REQUEST", (msg) => {
//         console.log("SCREEN_BRIGHTNESS_REQUEST:", msg);
//         io.emit("SCREEN_BRIGHTNESS_REQUEST", msg);
//     })
// }