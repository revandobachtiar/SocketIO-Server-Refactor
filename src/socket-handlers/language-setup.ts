import { Socket, Server } from "socket.io";
import { z } from "zod";

const currentLanguage = z.object({
    lang: z.string(),
});

const getLanguage = z.object({
});

const setLanguage = z.object({
    lang: z.string(),
});

const ackSetLanguage = z.object({
    success: z.boolean(),
    message: z.string(),
});

const eventSchemas = {
    LANGUAGE_CURRENT: currentLanguage,
    LANGUAGE_GET: getLanguage,
    LANGUAGE_SET: setLanguage,
};

const ackSchemas = {
    ACK_LANGUAGE_SET: ackSetLanguage,
}

export default function languageSetupHandlers(
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
                console.log(`${ackEventName} received`, payload);

                if (ack) {
                    ack({
                        status: "ok",
                        event: ackEventName,
                        robotId,
                    });
                }
            });
        }
    );



    socket.on("disconnect", () => {
        console.log(`[DISCONNECT] Socket disconnected: ${socket.data.robotId}`);
    });
}