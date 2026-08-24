import { Socket, Server } from "socket.io";
import { z } from "zod";

const scanWifiStream = z.object({});

const wifiScanStarted = z.object({
    timestamp: z.number(),
});
const wifiNetworkFound = z.object({
    ssid: z.string(),
    signal: z.number(),
    secured: z.boolean(),
    channel: z.number(),
    frequency: z.string(),
});

const wifiScanCompleted = z.object({
    total: z.number(),
    timestamp: z.number(),
});

const connectWifi = z.object({
    ssid: z.string(),
    password: z.string(),
});


const wifiConnecting = z.object({
    ssid: z.string(),
    status: z.string(), 
});


const wifiConnectProgress = z.object({
    stage: z.string(),
    progress: z.number(),
});


const wifiConnected = z.object({
    ssid: z.string(),
    ip: z.string(),
    gateway: z.string(),
});

const wifiConnectionFailed = z.object({
    ssid: z.string(),
    error: z.string(),
    message: z.string(),
});

const getWifiStatus = z.object({});

const wifiStatus = z.object({
    connected: z.boolean(),
    ssid: z.string(),
    signal: z.number(),
    ip: z.string(),
    uptime: z.number(),
});

const disconnectWifi = z.object({
    ssid: z.string(),
});

const forgetWifi = z.object({
    ssid: z.string(),
})

const eventSchemas = {
    SCAN_WIFI_STREAM : scanWifiStream,
    WIFI_SCAN_STARTED: wifiScanStarted,
    WIFI_NETWORK_FOUND: wifiNetworkFound,
    WIFI_SCAN_COMPLETED: wifiScanCompleted,
    CONNECT_WIFI: connectWifi,
    WIFI_CONNECTING: wifiConnecting,
    WIFI_CONNECTING_PROGRESS: wifiConnectProgress,
    WIFI_CONNECTED: wifiConnected,
    WIFI_CONNECTED_FAILED: wifiConnectionFailed,
    GET_WIFI_STATUS: getWifiStatus,
    WIFI_STATUS: wifiStatus,
    DISCONNECT_WIFI: disconnectWifi,
    FORGET_WIFI : forgetWifi
}

export default function wifiSetupHandler(
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
                        console.log(`${eventName} from: ${robotId} ${socket.id}`);
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