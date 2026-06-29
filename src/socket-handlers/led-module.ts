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

export type Talking = 
    z.infer<typeof talking>;

export type Listen = 
    z.infer<typeof listen>;

export type Recording = 
    z.infer<typeof recording>;

const eventSchemas = {
    TALKING: talking,
    LISTEN: listen,
    RECORDING: recording
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