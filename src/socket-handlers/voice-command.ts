import { Socket, Server } from "socket.io";
import { z } from "zod";
import { dateTimeSchema } from "../utils/formatDateTime.js";



const talking = z.object({
    datetime: dateTimeSchema,
})
const listen = z.object({
    datetime: dateTimeSchema,
})
const recording = z.object({
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
const uploadFailed = z.object({
    datetime: dateTimeSchema,
})
const wakeUpByStartUp = z.object({
    datetime: dateTimeSchema,
})

    export type Talking =
        z.infer<typeof talking>;

    export type Listen =
        z.infer<typeof listen>;

    export type Recording =
        z.infer<typeof recording>;

    export type Sleep =
        z.infer<typeof sleep>;

    export type WakeUp =
        z.infer<typeof wakeup>;

    export type Waiting =
        z.infer<typeof waiting>;

    export type UploadFailed =
        z.infer<typeof uploadFailed>;
        
    export type WakeUpByStartUp =
        z.infer<typeof wakeUpByStartUp>;


const eventSchemas = {
    TALKING: talking,
    LISTENING: listen,
    RECORDING: recording,
    SLEEP : sleep,
    WAKE_UP : wakeup,
    WAITING : waiting,
    UPLOAD_FAILED : uploadFailed,
    WAKE_UP_BY_START_UP: wakeUpByStartUp,
}


export default function voiceCommandHandler(
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
                    });
                }

            })
        }
    )
}