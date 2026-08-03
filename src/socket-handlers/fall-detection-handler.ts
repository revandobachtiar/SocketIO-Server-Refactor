import { Socket, Server } from "socket.io";
import { z, ZodObject, ZodRawShape, ZodSchema, ZodType } from "zod";
import { dateTimeSchema } from "../utils/date-time-schema";

const incidentFallEventDetected = z.object({
    datetime: dateTimeSchema,
});

const wakeUpByFallDetection = z.object({});

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
};

function formatZodError(error: z.ZodError): string {
    return error.issues
        .map((issue) => {
            const path = issue.path.length ? issue.path.join(".") : "(root)";
            return `${path}: ${issue.message} [${issue.code}]`;
        })
        .join("; ");
}
function registerValidatedEvent<T extends ZodRawShape>(
    socket: Socket,
    io: Server,
    eventName: string,
    schema: ZodObject<T>,
    logLabel: "emitted" | "received"
): void {
    socket.on(eventName, (msg: unknown, ack?: Function) => {
        const result = schema.safeParse(msg);

        if (!result.success) {
            const details = formatZodError(result.error);
            console.error(
                `[${eventName}] Validation Failed from robotId=${socket.data.robotId ?? "unknown"} | payload=${JSON.stringify(
                    msg
                )} | errors: ${details}`
            );

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
        console.log(`${eventName} ${logLabel}`, payload);

        if (ack) {
            ack({
                status: "ok",
                event: eventName,
                robotId,
                datetime: (payload as any).datetime,
            });
        }
    });
}

export default function fallDetectionHandler(socket: Socket, io: Server): void {
    Object.entries(eventSchemas).forEach(([eventName, schema]) => {
        registerValidatedEvent(socket, io, eventName, schema, "emitted");
    });

    Object.entries(ackSchemas).forEach(([ackEventName, schema]) => {
        registerValidatedEvent(socket, io, ackEventName, schema, "received");
    });

    socket.on("disconnect", () => {
        console.log(`[DISCONNECT] Socket disconnected: ${socket.data.robotId}`);
    });
}