import { Socket, Server } from "socket.io";
import { z } from "zod";
import { dateTimeSchema } from "../utils/formatDateTime";



// SCHEMA


const incidentFallEventDetected = z.object({
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

const ackFallEventDetected = z.object({
    datetime: dateTimeSchema,
});
const wakeUpByFallDetection = z.object({
    datetime: dateTimeSchema,
});

// const ackFallDownNoResponse = z.object({
//     datetime: dateTimeSchema,
// });

// const ackHelpEventDetected = z.object({
//     datetime: dateTimeSchema,
// });

// const ackOkEventDetected = z.object({
//     datetime: dateTimeSchema,
// });

// const ackCompleted = z.object({
//     datetime: dateTimeSchema,
// });



// TYPE


export type IncidentFallEventDetected =
    z.infer<typeof incidentFallEventDetected>;

export type IncidentFallDownNoResponese =
    z.infer<typeof incidentFallDownNoResponse>;

export type IncidentHelpEventDetected =
    z.infer<typeof incidentHelpEventDetected>;

export type IncidentOkEventDetected =
    z.infer<typeof incidentOkEventDetected>;

export type IncidentCompleted =
    z.infer<typeof incidentCompleted>;

export type AckFallEventDetected =
    z.infer<typeof ackFallEventDetected>;


export type WakeUpByFallDetection =
    z.infer<typeof wakeUpByFallDetection>;

// export type AckFallDownNoResponse =
//     z.infer<typeof ackFallDownNoResponse>;

// export type AckHelpEventDetected =
//     z.infer<typeof ackHelpEventDetected>;

// export type AckOkEventDetected =
//     z.infer<typeof ackOkEventDetected>;

// export type AckIncidentCompleted =
//     z.infer<typeof ackCompleted>;



// EVENT CONFIG


const eventSchemas = {
    INCIDENT_FALL_EVENT_DETECTED: incidentFallEventDetected,
    INCIDENT_FALL_DOWN_NO_RESPONSE: incidentFallDownNoResponse,
    INCIDENT_HELP_EVENT_DETECTED: incidentHelpEventDetected,
    INCIDENT_OK_EVENT_DETECTED: incidentOkEventDetected,
    INCIDENT_COMPLETED: incidentCompleted,
    WAKE_UP_BY_FALL_DETECTION: wakeUpByFallDetection,
};

const ackSchemas = {
    ACK_FALL_EVENT_DETECTED: ackFallEventDetected,
    // ACK_FALL_DOWN_NO_RESPONSE: ackFallDownNoResponse,
    // ACK_HELP_EVENT_DETECTED: ackHelpEventDetected,
    // ACK_OK_EVENT_DETECTED: ackOkEventDetected,
    // ACK_COMPLETED: ackCompleted,
};



export default function incidentHandlers(
    socket: Socket,
    io: Server
): void {

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
                            errors: result.error.issues,
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
                            errors: result.error.issues,
                        });
                    }
                    return;
                }

                const robotId = socket.data.robotId;
                const payload = {
                    ...result.data,
                };

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
        console.log(`[DISCONNECT] Socket disconnected: ${socket.data.robotId}`);
    });
}