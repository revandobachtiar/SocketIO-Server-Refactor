import { Socket, Server } from "socket.io";
import { z } from "zod";
import { dateTimeSchema } from "../utils/date-time-schema";

const reminderNotification = z.object ({
})

const preReminderNotification = z.object ({
})

const endReminderNotification = z.object ({})

const endPreReminderNotification =z.object ({})

const eventSchemas = {
    REMINDER_NOTIFICATION : reminderNotification,
    PRE_REMINDER_NOTIFICATION : preReminderNotification,
    END_REMINDER_NOTIFICATION : endReminderNotification,
    END_PRE_REMINDER_NOTIFICATION : endPreReminderNotification
}

export default function pushNotificationHandler(
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