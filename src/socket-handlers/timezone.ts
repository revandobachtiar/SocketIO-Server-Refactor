import { Socket, Server } from "socket.io";
import { success, z } from "zod";


const tzrequest = z.object({})
const tzinfo = z.object({
    timezone: z.string(),
    utc_offset: z.string()
})
const tzset = z.object({
    timezone: z.string()
})
const tzret = z.object({
    success: z.boolean(),
    timezone: z.string()
})


export type TzRequest = 
    z.infer<typeof tzrequest>;
export type TzInfo = 
    z.infer<typeof tzinfo>;
export type TzSet = 
    z.infer<typeof tzset>;
export type TzRet = 
    z.infer<typeof tzret>;

const eventSchemas = {
    TZ_REQUEST : tzrequest,
    TZ_INFO : tzinfo,
    TZ_SET : tzset,
    TZ_RET : tzret
}

export default function timezoneModuleHandler (
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