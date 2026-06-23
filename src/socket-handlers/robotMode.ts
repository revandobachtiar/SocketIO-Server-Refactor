import { Socket, Server } from "socket.io";
import { z } from "zod";
import { dateTimeSchema } from "../utils/formatDateTime";

const robotwakeup = z.object ({
    datetime: dateTimeSchema,
})

const robotsleep = z.object ({
    datetime: dateTimeSchema
})

export type RobotWakeUp = 
    z.infer<typeof robotwakeup>;
export type RobotSleep = 
    z.infer<typeof robotsleep>;

const eventSchemas = {
    ROBOT_WAKE_UP: robotwakeup,
    ROBOT_SLEEP: robotsleep
}



export default function robotModeHandlers(
    socket:Socket,
    io: Server
):void {
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
                            datetime: payload.datetime,
                        });
                    }
    
                })
            }
        )
}