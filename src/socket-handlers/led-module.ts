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

const upload_failed = z.object({
    datetime: dateTimeSchema
})

const eventSchemas = {
    TALKING: talking,
    LISTENING: listen,
    RECORDING: recording,
    SLEEP: sleep,
    WAKE_UP: wakeup,
    WAITING: waiting,
    UPLOAD_FAILED: upload_failed,
    INCIDENT_FALL_EVENT_DETECTED: incidentFallEvent,
    INCIDENT_FALL_EVENT_NO_RESPONSE: incidentHelpEvent,
    INCIDENT_HELP_EVENT_DETECTED: incidentHelpEvent,
    INCIDENT_OK_EVENT_DETECTED: incidentOkEvent
}

export default function ledModule(
    socket: Socket,
    io: Server
): void {

    Object.entries(eventSchemas).forEach(
        ([eventName, schema]) => {
            socket.on(eventName, (msg: unknown, ack?: Function) => {
                const result = schema.safeParse(msg);
                if (!result.success) {
                    const flatErrors = result.error.flatten();
                    console.error(
                        `[${eventName}] Validation Failed`,
                        JSON.stringify({
                            receivedPayload: msg,
                            fieldErrors: flatErrors.fieldErrors,
                            formErrors: flatErrors.formErrors,
                        }, null, 2)
                    );
                    if (ack) {
                        ack({
                            status: "error",
                            event: eventName,
                            message: "Validation failed",
                            errors: flatErrors,
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