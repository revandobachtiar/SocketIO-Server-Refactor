import { Socket, Server } from "socket.io";
import { z } from "zod";
import { dateTimeSchema } from "../utils/date-time-schema";
import { sensorPayloadSchema } from "../utils/sensor-payload-schema";


const devicePowerGet = z.object({
    datetime: dateTimeSchema,
})

const deviceStatusInfo = z.object({
    audio_report : z.string(),
    radar_report : z.string(),
})

const deviceStatusGet = z.object({
    datetime: dateTimeSchema,
})

const eventSchemas = {
    DEVICE_POWER_GET: devicePowerGet,
    DEVICE_POWER_INFO : sensorPayloadSchema,
    DEVICE_STATUS_GET : deviceStatusGet,
    DEVICE_STATUS_INFO : deviceStatusInfo
}

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
                        console.log(`${eventName} from: ${robotId} ${socket.id}`);
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