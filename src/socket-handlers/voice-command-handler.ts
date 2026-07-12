import { Socket, Server } from "socket.io";
import { z } from "zod";
import { dateTimeSchema } from "../utils/formatDateTime";

const medicineScheduleWeek = z.object({
    datetime: dateTimeSchema,
    robotId: z.string(),
});

const medicineScheduleMonth = z.object({
    datetime: dateTimeSchema,
    robotId: z.string(),
});

const medicineScheduleSpecificDay = z.object({
    datetime: dateTimeSchema,
    robotId: z.string(),
});

const appointmentScheduleWeek = z.object({
    datetime: dateTimeSchema,
    robotId: z.string(),
});

const appointmentScheduleMonth = z.object({
    datetime: dateTimeSchema,
    robotId: z.string(),
})

const apointmentScheduleSpecificDay = z.object({
    datetime: dateTimeSchema,
    robotId: z.string(),
})

const healthActivityWeek = z.object({
    datetime: dateTimeSchema,
    robotId: z.string(),
})

const healthActivitMonth = z.object({
    datetime: dateTimeSchema,
    robotId: z.string(),
})

const healthActivitySpecificDay = z.object({
    datetime: dateTimeSchema,
    robotId: z.string(),
})

const socialActivityWeek = z.object({
    datetime: dateTimeSchema,
    robotId: z.string(),
})

const socialActivityMonth = z.object({
    datetime: dateTimeSchema,
    robotId: z.string(),
})

const socialActivitySpecificDay = z.object({
    datetime: dateTimeSchema,
    robotId: z.string(),
})

const visitsWeek = z.object({
    datetime: dateTimeSchema,
    robotId: z.string(),
})

const visitsMonth = z.object({
    datetime: dateTimeSchema,
    robotId: z.string(),
})

const visitsSpecificDay = z.object({
    datetime: dateTimeSchema,
    robotId: z.string(),
})

const invoiceWeek = z.object({
    datetime: dateTimeSchema,
    robotId: z.string(),
})

const invoiceMonth = z.object({
    datetime: dateTimeSchema,
    robotId: z.string(),
})

const invoiceSpecificDay = z.object({
    datetime: dateTimeSchema,
    robotId: z.string(),
})

const showTodayReminders = z.object({
    datetime: dateTimeSchema,
    robotId: z.string(),
})

const eventSchemas = {
    MEDICINE_SCHEDULE_WEEK: medicineScheduleWeek,
    MEDICINE_SCHEDULE_MONTH: medicineScheduleMonth,
    MEDICINE_SCHEDULE_SPECIFIC_DAY: medicineScheduleSpecificDay,
    APPOINTMENT_SCHEDULE_WEEK: appointmentScheduleWeek,
    APPOINTMENT_SCHEDULE_MONTH: appointmentScheduleMonth,
    APPOINTMENT_SCHEDULE_SPECIFIC_DAY: apointmentScheduleSpecificDay,
    HEALTH_ACTIVITY_WEEK: healthActivityWeek,
    HEALTH_ACTIVITY_MONTH: healthActivitMonth,
    HEALTH_ACTIVITY_SPECIFIC_DAY: healthActivitySpecificDay,
    SOCIAL_ACTIVITY_WEEK: socialActivityWeek,
    SOCIAL_ACTIVITY_MONTH: socialActivityMonth,
    SOCIAL_ACTIVITY_SPECIFIC_DAY: socialActivitySpecificDay,
    VISITS_WEEK: visitsWeek,
    VISISTS_MONTH: visitsMonth,
    VISITS_SPECIFIC_DAY: visitsSpecificDay,
    INVOICE_WEEK: invoiceWeek,
    INVOICE_MONTH: invoiceMonth,
    INVOICE_SPECIFIC_DAY: invoiceSpecificDay,
    TODAY_REMINDERS: showTodayReminders,
};

export default function voiceCommandHandler(
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
                const robotIdTarget = payload.robotId;

                console.log(`${eventName} from: ${robotId}`);
                io.to(robotIdTarget).emit(eventName, payload);
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