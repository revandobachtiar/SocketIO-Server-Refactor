import { Socket, Server } from "socket.io";
import { z } from "zod";
import { dateTimeSchema } from "../utils/date-time-schema";

const alarmset = z.object ({
    datetime:dateTimeSchema,
})

const alarmring = z.object ({
    datetime:dateTimeSchema,
})

const alarmstop = z.object ({
    datetime:dateTimeSchema,
})

const alarmsnooze = z.object ({
    datetime:dateTimeSchema,
})

export type AlarmSet = 
    z.infer<typeof alarmset>;
export type AlarmRing = 
    z.infer<typeof alarmring>;
export type AlarmStop = 
    z.infer<typeof alarmstop>;
export type AlarmSnooze = 
    z.infer<typeof alarmsnooze>;

const eventSchemas = {
    ALARM_SET: alarmset,
    ALARM_RING: alarmring,
    ALARM_STOP: alarmstop,
    ALARM_SNOOZE: alarmsnooze
}



export default function alarmHandler(
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
                                datetime: payload.datetime,
                            });
                        }
        
                    })
                }
            )
}