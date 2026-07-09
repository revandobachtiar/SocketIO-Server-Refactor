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


const wifiDisconnected = z.object({
    ssid: z.string(),
    reason: z.string(),
    timestamp: z.number(),
});


const disconnectWifi = z.object({
    ssid: z.string(),
});


const wifiError = z.object({
    error_code: z.string(),
    message: z.string(),
});

const forgetWifi = z.object({
    ssid: z.string(),
});


export type ScaneWifiStream = 
    z.infer<typeof scanWifiStream>;
export type WifiScanStarted = 
    z.infer<typeof wifiScanStarted>;
export type WifiNetworkFound = 
    z.infer<typeof wifiNetworkFound>;
export type WifiScanCompleted = 
    z.infer<typeof wifiScanCompleted>;
export type ConnectWifi =
    z.infer<typeof connectWifi>;
export type WifiConnecting =
    z.infer<typeof wifiConnecting>;
export type WifiConnectProgress = 
    z.infer<typeof wifiConnectProgress>;
export type WifiConnected = 
    z.infer<typeof wifiConnected>;
export type WifiConnectionFailed = 
    z.infer<typeof wifiConnectionFailed>;
export type GetWifiStatus =
    z.infer<typeof getWifiStatus>;
export type WifiStatus = 
    z.infer<typeof wifiStatus>
export type WifiDisconnected = 
    z.infer<typeof wifiDisconnected>;
export type DisconnectWifi = 
    z.infer<typeof disconnectWifi>;
export type WifiError =
    z.infer<typeof wifiError>;
export type ForgetWifi =
    z.infer<typeof forgetWifi>;

const eventSchemas = {
    SCAN_WIFI_STREAM : scanWifiStream,
    WIFI_SCAN_STARTED: wifiScanStarted,
    WIFI_NETWORK_FOUND: wifiNetworkFound,
    WIFI_SCAN_COMPLETED: wifiScanCompleted,
    CONNECT_WIFI: connectWifi,
    WIFI_CONNECTING: wifiConnecting,
    WIFI_CONNECTION_PROGRESS: wifiConnectProgress,
    WIFI_CONNECTED: wifiConnected,
    WIFICONNECTION_FAILED: wifiConnectionFailed,
    GET_WIFI_STATUS: getWifiStatus,
    WIFI_STATUS: wifiStatus,
    WIFI_DISCONNECTED: wifiDisconnected,
    DISCONNECTED_WIFI: disconnectWifi,
    WIFI_ERROR: wifiError,
    FORGET_WIFI: forgetWifi
}

export default function wifiModuleHandler(
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