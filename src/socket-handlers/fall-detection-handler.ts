import { Socket, Server } from "socket.io";
import { z } from "zod";
import { dateTimeSchema } from "../utils/date-time-schema";


const incidentFallEventDetected = z.object({
    datetime: dateTimeSchema,
});

const wakeUpByFallDetection = z.object({})

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

const iAmOk = z.object({
    datetime: dateTimeSchema,
})

const help = z.object({
    datetime: dateTimeSchema,
})

const eventSchemas = {
    INCIDENT_FALL_EVENT_DETECTED: incidentFallEventDetected,
    INCIDENT_FALL_DOWN_NO_RESPONSE: incidentFallDownNoResponse,
    INCIDENT_HELP_EVENT_DETECTED: incidentHelpEventDetected,
    INCIDENT_OK_EVENT_DETECTED: incidentOkEventDetected,
    INCIDENT_COMPLETED: incidentCompleted,
    WAKE_UP_BY_FALL_DETECTION: wakeUpByFallDetection,
    I_AM_OK: iAmOk,
    HELP: help
};

const ackSchemas = {
    ACK_FALL_EVENT_DETECTED: ackFallEventDetected,
};



export default function fallDetectionHandler(
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

                console.log(`${ackEventName} from: ${robotId}`);
                io.to(robotId).emit(ackEventName, payload);
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