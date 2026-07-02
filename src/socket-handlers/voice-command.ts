import { Socket, Server } from "socket.io";
import { z } from "zod";
import { dateTimeSchema } from "../utils/formatDateTime";

const medicineScheduleWeek  = z.object({
    datetime: dateTimeSchema,
    robotId : z.string(),
});

const medicineScheduleMonth  = z.object({
    datetime: dateTimeSchema,
    robotId : z.string(),
});

const medicineScheduleSpecificDay  = z.object({
    datetime: dateTimeSchema,
    robotId : z.string(),
});

const appointmentScheduleWeek  = z.object({
    datetime: dateTimeSchema,
    robotId : z.string(),
});

const appointmentScheduleMonth  = z.object({
    datetime: dateTimeSchema,
    robotId : z.string(),
})

const apointmentScheduleSpecificDay  = z.object({
    datetime: dateTimeSchema,
    robotId : z.string(),
})

const eventSchemas = {
    MEDICINE_SCHEDULE_WEEK: medicineScheduleWeek,
    MEDICINE_SCHEDULE_MONTH: medicineScheduleMonth,
    MEDICINE_SCHEDULE_SPECIFIC_DAY: medicineScheduleSpecificDay,
    APPOINTMENT_SCHEDULE_WEEK: appointmentScheduleWeek,
    APPOINTMENT_SCHEDULE_MONTH: appointmentScheduleMonth,
    APPOINTMENT_SCHEDULE_SPECIFIC_DAY: apointmentScheduleSpecificDay,
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

    socket.on("disconnect", () => {
        console.log(`[DISCONNECT] Socket disconnected: ${socket.data.robotId}`);
    });
}