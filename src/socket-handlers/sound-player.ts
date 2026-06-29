import { Socket, Server } from "socket.io";
import { z } from "zod";
import { dateTimeSchema } from "../utils/formatDateTime";

const incidentFallDetected = z.object({
    datetime: dateTimeSchema,
})

const IncidentFallDownNoResponse = z.object({
    datetime: dateTimeSchema,
})

const IncidentHelpEventDetected = z.object({
    datetime: dateTimeSchema,
})

const IncidentOkEventDetected = z.object({
    datetime: dateTimeSchema,
})

export type IncidentFallDetected = 
    z.infer<typeof incidentFallDetected>;

export type IncidentFallDownNoResponse = 
    z.infer<typeof IncidentFallDownNoResponse>;

export type IncidentHelpEventDetected = 
    z.infer<typeof IncidentHelpEventDetected>;

export type IncidentOkEventDetected = 
    z.infer<typeof IncidentOkEventDetected>;

const eventSchemas = {
    INCIDENT_FALL_DOWN_DETECTED: incidentFallDetected,
    INCIDENT_FALL_DOWN_NO_RESPONSE: IncidentFallDownNoResponse,
    INCIDENT_HELP_EVENT_DETECTED: IncidentHelpEventDetected,
    INCIDENT_OK_EVENT_DETECTED: IncidentOkEventDetected
}

export default function speechModuleListener(
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