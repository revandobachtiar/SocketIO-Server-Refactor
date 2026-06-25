import { Socket, Server } from "socket.io";
import { z } from "zod";
import { dateTimeSchema } from "../utils/formatDateTime";



// SCHEMA


const incidentFallDownDetected = z.object({
    datetime: dateTimeSchema,
});

const incidentFallDownNoResponse = z.object({
    datetime: dateTimeSchema,
});

const incidentHelpEventDetected = z.object({
    datetime: dateTimeSchema,
});

const incidentOkEventDetected = z.object({
    datetime: dateTimeSchema,
});

const incidentCompleted = z.object({
    datetime: dateTimeSchema,
});

const ackFallDownDetected = z.object({
    datetime: dateTimeSchema,
});

const ackFallDownNoResponse = z.object({
    datetime: dateTimeSchema,
});

const ackHelpEventDetected = z.object({
    datetime: dateTimeSchema,
});

const ackOkEventDetected = z.object({
    datetime: dateTimeSchema,
});

const ackCompleted = z.object({
    datetime: dateTimeSchema,
});



// TYPE


export type IncidentFallDownDetected =
    z.infer<typeof incidentFallDownDetected>;

export type IncidentFallDownNoResponese =
    z.infer<typeof incidentFallDownNoResponse>;

export type IncidentHelpEventDetected =
    z.infer<typeof incidentHelpEventDetected>;

export type IncidentOkEventDetected =
    z.infer<typeof incidentOkEventDetected>;

export type IncidentCompleted =
    z.infer<typeof incidentCompleted>;

export type AckFallDownDetected =
    z.infer<typeof ackFallDownDetected>;

export type AckFallDownNoResponse =
    z.infer<typeof ackFallDownNoResponse>;

export type AckHelpEventDetected =
    z.infer<typeof ackHelpEventDetected>;

export type AckOkEventDetected =
    z.infer<typeof ackOkEventDetected>;

export type AckIncidentCompleted =
    z.infer<typeof ackCompleted>;



// EVENT CONFIG


const RETRY_INTERVAL_MS = 3000;

const eventSchemas = {
    INCIDENT_FALL_DOWN_DETECTED: incidentFallDownDetected,
    INCIDENT_FALL_DOWN_NO_RESPONSE: incidentFallDownNoResponse,
    INCIDENT_HELP_EVENT_DETECTED: incidentHelpEventDetected,
    INCIDENT_OK_EVENT_DETECTED: incidentOkEventDetected,
    INCIDENT_COMPLETED: incidentCompleted,
};

const ackSchemas = {
    ACK_FALL_DOWN_DETECTED: ackFallDownDetected,
    ACK_FALL_DOWN_NO_RESPONSE: ackFallDownNoResponse,
    ACK_HELP_EVENT_DETECTED: ackHelpEventDetected,
    ACK_OK_EVENT_DETECTED: ackOkEventDetected,
    ACK_COMPLETED: ackCompleted,
};

const eventToAck: Record<string, string> = {
    INCIDENT_FALL_DOWN_DETECTED:    "ACK_FALL_DOWN_DETECTED",
    INCIDENT_FALL_DOWN_NO_RESPONSE: "ACK_FALL_DOWN_NO_RESPONSE",
    INCIDENT_HELP_EVENT_DETECTED:   "ACK_HELP_EVENT_DETECTED",
    INCIDENT_OK_EVENT_DETECTED:     "ACK_OK_EVENT_DETECTED",
    INCIDENT_COMPLETED:             "ACK_COMPLETED",
};



export default function incidentHandlers(
    socket: Socket,
    io: Server
): void {

    const activeTimers = new Map<string, ReturnType<typeof setInterval>>();


    Object.entries(eventSchemas).forEach(
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

    
                const timer = setInterval(() => {
                    io.to(robotId).emit(eventName, payload);
                    console.log(`[${eventName}] Retrying to ${robotId}`);
                }, RETRY_INTERVAL_MS);

                activeTimers.set(eventName, timer);

                if (ack) {
                    ack({
                        status: "ok",
                        event: eventName,
                        robotId,
                        datetime: payload.datetime,
                    });
                }
            });
        }
    );

  

    Object.entries(ackSchemas).forEach(
        ([ackEventName, schema]) => {
            socket.on(ackEventName, (msg: unknown, ack?: Function) => {

                const result = schema.safeParse(msg);

                if (!result.success) {
                    console.error(`[${ackEventName}] Validation Failed`);
                    if (ack) {
                        ack({
                            status: "error",
                            event: ackEventName,
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

        
                const mainEvent = Object.keys(eventToAck).find(
                    (key) => eventToAck[key] === ackEventName
                );

                if (mainEvent && activeTimers.has(mainEvent)) {
                    clearInterval(activeTimers.get(mainEvent));
                    activeTimers.delete(mainEvent);
                    console.log(`[${ackEventName}] Retry "${mainEvent}" stopped, UI ${robotId} confirmed`);
                }

                console.log(`${ackEventName} from: ${robotId}`);
                console.log(`${ackEventName} received`, payload);

                if (ack) {
                    ack({
                        status: "ok",
                        event: ackEventName,
                        robotId,
                        datetime: payload.datetime,
                    });
                }
            });
        }
    );



    socket.on("disconnect", () => {
        activeTimers.forEach((timer) => clearInterval(timer));
        activeTimers.clear();
        console.log(`[DISCONNECT] All cleared for ${socket.data.robotId}`);
    });
}