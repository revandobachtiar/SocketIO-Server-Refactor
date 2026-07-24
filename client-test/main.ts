import { io, Socket } from "socket.io-client";
import readline from "readline";

const SERVER = "https://elderly-care-socket-io-server.online";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let socket: Socket;

const robotProcessorMap: Record<string, string> = {
    "TESTING-1": "4ac69a4a6eac51d6",
    "TESTING-2": "10000000abcd5678",
    "TESTING-3": "10000000abcd9999",
    "TESTING-4": "10000000abcd8888",
    "TESTING-5": "10000000abcd7777",
};

const robots = [
    "TESTING-1",
    "TESTING-2",
    "TESTING-3",
    "TESTING-4",
    "TESTING-5",
];


let currentWifi = {
    connected: true,
    ssid: "Parametrik02",
    signal: -42,
    ip: "192.168.1.100",
    uptime: 3600,
};

function sendScanWifi() {

    console.log("\n- SEND SCAN_WIFI_STREAM");
    socket.emit("SCAN_WIFI_STREAM", {}, (response: any) => {

        

    });
    showMenu();

}

function sendConnectWifi(ssid: string, password: string) {

    const payload = {
        ssid,
        password,
    };

    console.log("\n- SEND CONNECT_WIFI");
    console.log(payload);

    socket.emit("CONNECT_WIFI", payload, (response: any) => {

    

    });
    showMenu();

}
function sendGetWifiStatus() {

    console.log("\n- SEND GET_WIFI_STATUS");
    socket.emit("GET_WIFI_STATUS", {}, (response: any) => {

        

    });
    showMenu();

}
function sendDisconnectWifi(ssid: string) {

    const payload = {
        ssid,
    };

    console.log("\n- SEND DISCONNECT_WIFI");
    console.log(payload);

    socket.emit("DISCONNECT_WIFI", payload, (response: any) => {


        showMenu();

    });

}

function sendForgetWifi(ssid: string) {

    const payload = {
        ssid,
    };

    console.log("\n- SEND FORGET_WIFI");
    console.log(payload);

    socket.emit("FORGET_WIFI", payload, (response: any) => {


        showMenu();

    });
}

function sendWakeUp() {
    const payload = {
        datetime: now(),
    };

    socket.emit("WAKE_UP", payload);
}

function sendSleep() {
    const payload = {
        datetime: now(),
    };

    socket.emit("SLEEP", payload);
}

function now(): string {

    const date = new Date();

    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();

    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");

    return `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;
}
function sendAck(eventName: string, datetime: string) {

    const payload = {
        datetime,
    };

    console.log(`\n- SEND ${eventName}`);
    console.log(payload);

    socket.emit(eventName, payload, (response: any) => {

        console.log(`- ACK ${eventName}`);
        console.log(response);
    });

}
function sendTimezoneRequest() {

    const payload = {
        datetime: now(),
    };

    console.log("\n- SEND TZ_REQUEST");
    console.log(payload);

    socket.emit("TZ_REQUEST", payload, (response: any) => {

        console.log(response);

        showMenu();

    });

}
function sendTimezoneSet(timezone: string) {

    const payload = {
        timezone,
    };

    console.log("\n- SEND TZ_SET");
    console.log(payload);

    socket.emit("TZ_SET", payload);

    showMenu();

}

function connectRobot(robotId: string) {

    socket = io(SERVER, {
        transports: ["websocket"],
        auth: {
            robotId,
            processorId: robotProcessorMap[robotId],
        },
    });

    socket.on("connect", () => {

        console.log("\n==================================");
        console.log("Connected");
        console.log("Server   :", SERVER);
        console.log("Robot ID :", robotId);
        console.log("Socket ID:", socket.id);
        console.log("==================================");

        socket.on("INCIDENT_FALL_EVENT_DETECTED", (data) => {

            console.log(`\n* RECEIVE INCIDENT_FALL_EVENT_DETECTED`);
            console.log(data);

            sendAck("ACK_FALL_EVENT_DETECTED", data.datetime);
        });

        socket.on("INCIDENT_FALL_DOWN_NO_RESPONSE", (data) => {

            console.log(`\n* RECEIVE INCIDENT_FALL_DOWN_NO_RESPONSE`);
            console.log(data);

            
        });

        socket.on("INCIDENT_HELP_EVENT_DETECTED", (data) => {

            console.log(`\n* RECEIVE INCIDENT_HELP_EVENT_DETECTED`);
            console.log(data);
        });

        socket.on("INCIDENT_OK_EVENT_DETECTED", (data) => {

            console.log(`\n* RECEIVE INCIDENT_OK_EVENT_DETECTED`);
            console.log(data);
        });

        socket.on("INCIDENT_COMPLETED", (data) => {

            console.log(`\n* RECEIVE INCIDENT_COMPLETED`);
            console.log(data);
        });

        socket.on("WAKE_UP_BY_FALL_DETECTION", (data) => {

            console.log(`\n* RECEIVE WAKE_UP_BY_FALL_DETECTION`);
            console.log(data);
        });

        socket.on("LANGUAGE_CURRENT", (data) => {

            console.log("\n* RECEIVE LANGUAGE_CURRENT");
            console.log(data);

            sendAckLanguage(true, "Language Updated");
        });
        socket.on("WIFI_SCAN_STARTED", (data) => {

            console.log("\n* RECEIVE WIFI_SCAN_STARTED");
            console.log(data);

        });
        socket.on("WIFI_NETWORK_FOUND", (data) => {

            console.log("\n* RECEIVE WIFI_NETWORK_FOUND");
            console.log(data);

        });
        socket.on("WIFI_SCAN_COMPLETED", (data) => {

            console.log("\n* RECEIVE WIFI_SCAN_COMPLETED");
            console.log(data);

        });
        socket.on("WIFI_CONNECTING", (data) => {

            console.log("\n* RECEIVE WIFI_CONNECTING");
            console.log(data);

        });
        socket.on("WIFI_CONNECTING_PROGRESS", (data) => {

            console.log("\n* RECEIVE WIFI_CONNECTING_PROGRESS");
            console.log(data);

        });
        socket.on("WIFI_CONNECTED", (data) => {

            console.log("\n* RECEIVE WIFI_CONNECTED");
            console.log(data);

        });
        socket.on("WIFI_CONNECTED_FAILED", (data) => {

            console.log("\n* RECEIVE WIFI_CONNECTED_FAILED");
            console.log(data);

        });
        socket.on("WIFI_STATUS", (data) => {

            console.log("\n* RECEIVE WIFI_STATUS");
            console.log(data);

        });
        socket.on("DISCONNECT_WIFI", (data) => {

            console.log("\n* RECEIVE DISCONNECT_WIFI");
            console.log(data);

        });
        socket.on("FORGET_WIFI", (data) => {

            console.log("\n* RECEIVE FORGET_WIFI");
            console.log(data);
        });

        socket.on("I_AM_OK", (data) => {
            
            console.log("\n* RECEIVE I_AM_OK");
            console.log(data);

            sendEvent("INCIDENT_OK_EVENT_DETECTED");
        });

        socket.on("HELP", (data) => {

            console.log("\n* RECEIVE HELP");
            console.log(data);
            sendEvent("INCIDENT_HELP_EVENT_DETECTED");
        });
        
// Wakeup / Sleep & Voice Command
        socket.on("WAKE_UP", (data) => {

            console.log("\n* RECEIVE WAKE_UP");
            console.log(data);

        });
        socket.on("SLEEP", (data) => {

            console.log("\n* RECEIVE SLEEP");
            console.log(data);  
         });

        socket.on("WAITING", (data) => {

            console.log("\n* RECEIVE WAITING");
            console.log(data);

        });

        socket.on("TALKING", (data) => {

            console.log("\n* RECEIVE TALKING");
            console.log(data);

        });

        socket.on("RECORDING", (data) => {

            console.log("\n* RECEIVE RECORDING");
            console.log(data);
        });

        socket.on("SLEEP", (data) => {

            console.log("\n* RECEIVE SLEEP");
            console.log(data);

        });

        socket.on("LISTENING", (data) => {

            console.log("\n* RECEIVE LISTEN");
            console.log(data);

        });

        socket.on("UPLOAD_FAILED", (data) => {

            console.log("\n* RECEIVE UPLOAD_FAILED");
            console.log(data);

        });
        socket.on("PLAYING_SOUND", (data) => {
            console.log("\n* RECEIVE PLAYING_SOUND");
            console.log(data);

        });

        socket.on("SOUND_PLAYED", (data) => {
            console.log("\n* RECEIVE SOUND_PLAYED");
            console.log(data);
        });
        socket.on("SCREEN_BRIGHTNESS_SET", (data) => {

            console.log("\n* RECEIVE SCREEN_BRIGHTNESS_SET");
            console.log(data);

        });

        socket.on("VOLUME_SET", (data) => {

            console.log("\n* RECEIVE VOLUME_SET");
            console.log(data);

        });
        socket.on("TZ_INFO", (data) => {
            console.log("\n* RECEIVE TZ_INFO");
            console.log(data);

        });

        socket.on("TZ_RET", (data) => {

            console.log("\n* RECEIVE TZ_RET");
            console.log(data);
        });

        showMenu();
    });

    socket.onAny((event, data) => {
        console.log(`\n* EVENT ${event}`);
        console.log(data);
    });

    socket.on("disconnect", () => {
        console.log("\nDisconnected");
    });

    socket.on("connect_error", (err) => {
        console.log("\nConnection Error:", err.message);
    });
}

function sendEvent(eventName: string) {

    const payload = {
        datetime: now(),
    };

    console.log(`\n- SEND ${eventName}`);
    console.log(payload);

    socket.emit(eventName, payload, (response: any) => {

        console.log(`- ACK ${eventName}`);
        console.log(response);

        showMenu();
    });
}

function mockWifiConnect() {

    console.log({
        ssid: "Parametrik02",
        status: "authenticating",
    });

    console.log({
        stage: "obtaining_ip",
        progress: 50,
    });

    console.log({
        ssid: "Parametrik02",
        ip: "192.168.1.100",
        gateway: "192.168.1.1",
    });
    showMenu();

}

function sendLevelEvent(
    eventName: "SCREEN_BRIGHTNESS_SET" | "VOLUME_SET",
    level: number
) {

    if (level < 1 || level > 15) {
        console.log("Level harus antara 1 - 15");
        showMenu();
        return;
    }

    const payload = {
        level,
    };

    console.log(`\n- SEND ${eventName}`);
    console.log(payload);

    socket.emit(eventName, payload, (response: any) => {

        console.log(response);

        showMenu();

    });

}

function mockWifiFailed() {

    console.log({
        ssid: "Parametrik02",
        error: "incorrect_password",
        message: "authentication failed",
    });

}

function mockWifiStatus() {

    console.log(currentWifi);
    showMenu();

}

function sendLanguageSet(lang: "id" | "en" | "sv") {

    const payload = {
        lang,
    };

    console.log("\n- SEND LANGUAGE_SET");
    console.log(payload);

    socket.emit("LANGUAGE_SET", payload, (response: any) => {

        console.log("- ACK LANGUAGE_SET");
        console.log(response);

        showMenu();
    });
}
function sendLanguageGet() {

    const payload = {};

    console.log("\n- SEND LANGUAGE_GET");

    socket.emit("LANGUAGE_GET", payload, (response: any) => {

    

        showMenu();
    });
}
function sendAckLanguage(success: boolean, message: string) {

    const payload = {
        success,
        message,
    };

    console.log("\n- SEND ACK_LANGUAGE_SET");
    console.log(payload);

    socket.emit("ACK_LANGUAGE_SET", payload, (response: any) => {

        console.log("- ACK ACK_LANGUAGE_SET");
        console.log(response);
    });
}

function showMenu() {

    console.log("\n=========== INCIDENT TEST ===========");
    console.log("1. Fall Down Detected");
    console.log("2. No Response");
    console.log("3. Help Event");
    console.log("4. OK Event");
    console.log("5. Incident Completed");

    console.log("\n=========== LANGUAGE SETUP ==========");
    console.log("6. Get Current Language");
    console.log("7. Set Indonesia (id)");
    console.log("8. Set English (en)");
    console.log("9. Set Swedish (sv)");

    console.log("\n=========== OTHER ===================");
    console.log("A. Change Robot");
    console.log("0. Exit");
    console.log("=====================================");

    console.log("\n=========== WIFI SETUP ==============");
    console.log("10. Scan Wifi");
    console.log("11. Connect Wifi");
    console.log("12. Get Wifi Status");
    console.log("13. Disconnect Wifi");
    console.log("14. Forget Wifi");
    console.log("15. Wake Up Robot");
    console.log("16. Put to Sleep");
    console.log("b. Play Sound");
    console.log("c. Played Sound")
    console.log("\n=========== VOLUME & BRIGHTNESS =========");
    console.log("d. Set Screen Brightness");
    console.log("e. Set Volume");
    console.log("\n=========== TIMEZONE =========");
    console.log("f. Request Current Timezone");
    console.log("g. Set Timezone");
    rl.question("Choose : ", (answer) => {

        switch (answer.toLowerCase()) {

            case "1":
                sendEvent("INCIDENT_FALL_EVENT_DETECTED");
                break;

            case "2":
                sendEvent("INCIDENT_FALL_DOWN_NO_RESPONSE");
                break;

            case "3":
                sendEvent("INCIDENT_HELP_EVENT_DETECTED");
                break;

            case "4":
                sendEvent("INCIDENT_OK_EVENT_DETECTED");
                break;

            case "5":
                sendEvent("INCIDENT_COMPLETED");
                break;

            case "6":
                sendLanguageGet();
                break;

            case "7":
                sendLanguageSet("id");
                break;

            case "8":
                sendLanguageSet("en");
                break;

            case "9":
                sendLanguageSet("sv");
                break;

            case "10":
                sendScanWifi();
                break;

            case "11":
                sendConnectWifi("Parametrik02", "tabassam2");
                break;
            case "12":
                sendGetWifiStatus();
                break;
            case "13":
                sendDisconnectWifi(currentWifi.ssid);
                break;
            case "14":
                sendForgetWifi(currentWifi.ssid);
                break;
            case "15":
                sendWakeUp();
                break;
            case "16":
                sendSleep();
                break;
            case "b":
                sendEvent("PLAYING_SOUND");
                break;
            case "d":

                rl.question("Brightness Level (1-15): ", (value) => {
                    sendLevelEvent(
                        "SCREEN_BRIGHTNESS_SET",
                        Number(value)
                    );

                });
                break;

            case "e":
                rl.question("Volume Level (1-15): ", (value) => {

                    sendLevelEvent(
                        "VOLUME_SET",
                        Number(value)
                    );
                });
            case "f":
                sendTimezoneRequest();
                break;

            case "g":

            console.log("\nSelect Timezone");
            console.log("1. Asia/Jakarta");
                console.log("2. Europe/Stockholm");

                rl.question("Choose : ", (value) => {

                    switch (value) {

                        case "1":
                            sendTimezoneSet("Asia/Jakarta");
                            break;

                        case "2":
                            sendTimezoneSet("Europe/Stockholm");
                            break;

                        default:
                            console.log("Invalid Timezone");
                            showMenu();
                            break;
                    }

                });

                break;

            case "c":
                sendEvent("SOUND_PLAYED");
                break;
            case "a":
                socket.disconnect();
                selectRobot();
                break;

            case "0":
                socket.disconnect();
                rl.close();
                process.exit(0);

            default:
                console.log("Invalid Choice");
                showMenu();
        }

    });
}

function selectRobot() {

    console.log("\nSELECT ROBOT");

    robots.forEach((robot, index) => {
        console.log(`${index + 1}. ${robot}`);
    });

    console.log("0. Exit");

    rl.question("\nSelect Robot : ", (answer) => {

        const index = Number(answer) - 1;

        if (answer === "0") {
            rl.close();
            process.exit(0);
        }

        if (index >= 0 && index < robots.length) {
            connectRobot(robots[index]);
        } else {
            console.log("Invalid Robot");
            selectRobot();
        }

    });
}

selectRobot();