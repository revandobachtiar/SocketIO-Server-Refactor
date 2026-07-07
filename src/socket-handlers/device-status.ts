import { Socket, Server } from "socket.io";
import { z } from "zod";

const deviceStatusGet = z.object({
    timestamp: z.number(),
}); 
const deviceStatusInfo = z.object({
    voltage: z.number(),
    current: z.number(),
    power_cons: z.number(),
    frequency: z.number(),
    pf: z.number(),
    audio: z.string(),
    radar: z.string(),
});

export type DeviceStatusGet =
    z.infer<typeof deviceStatusGet>;
export type DeviceStatusInfo =
    z.infer<typeof deviceStatusInfo>;


const eventSchemas = {
    DEVICE_STATUS_GET: deviceStatusGet,
    DEVICE_STATUS_INFO: deviceStatusInfo,
};

export default function deviceStatusHandler(
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