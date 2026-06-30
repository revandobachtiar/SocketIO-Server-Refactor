import { Socket, Server } from "socket.io";
import { z } from "zod";
import { dateTimeSchema } from "../utils/formatDateTime";

const talking = z.object({
    datetime: dateTimeSchema,
})
const listen = z.object({
    datetime: dateTimeSchema,
})
const recording = z.object({
    datetime: dateTimeSchema,
})

const incidentFallEvent = z.object({
    datetime: dateTimeSchema,
})

const incidentHelpEvent = z.object({
    datetime: dateTimeSchema,
})

const incidentOkEvent = z.object({
    datetime: dateTimeSchema,
})

const wakeup = z.object({
    datetime: dateTimeSchema,
})

const waiting = z.object({
    datetime: dateTimeSchema,
})

const sleep = z.object({
    datetime: dateTimeSchema,
})

const eventSchemas = {
    TALKING: talking,
    LISTEN: listen,
    RECORDING: recording,
    SLEEP : sleep,
    WAKE_UP : wakeup,
    WAITING : waiting,
    INCIDENT_FALL_EVENT_DETECTED: incidentFallEvent,
    INCIDENT_FALL_EVENT_NO_RESPONSE: incidentHelpEvent,
    INCIDENT_HELP_EVENT_DETECTED: incidentHelpEvent,
    INCIDENT_OK_EVENT_DETECTED: incidentOkEvent
}

export default function ledModule(
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