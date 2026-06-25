import {
    wifi_scan_started,
    scan_wifi_stream,
    connect_wifi,
    get_wifi_status,
    disconnect_wifi,
    wifi_status,
    wifi_connecting,
    wifi_scan_completed,
    wifi_network_found,
    wifi_connection_progress,
    wifi_connected,
    wifi_connection_failed,
    wifi_disconnected,
    wifi_error,
    tz_info,
    tz_ret
} from "../schema/message-schema.js";

export default function wifiHandlers(socket, io) {
    //1.--------------- WIFI scan started----------------------------------------------------------------
    socket.on("wifi_scan_started", (msg) => {
        try {
            console.log("wifi_scan_started:", msg, "from:", socket.userId);
            const parsed =
                typeof msg === "string" ? JSON.parse(msg) : msg;

            const validated = wifi_scan_started.safeParse(parsed);

            if (!validated.success) {
                console.log("VALIDATION ERROR:", validated.error);

                socket.emit("error", {
                    event: "wifi_scan_started",
                    message: "Validation failed",
                    detail: validated.error,
                });
                return;
            }

            //const result = parsed.data;
            const result = validated.data;

            io.emit("wifi_scan_started", result);
        } catch (err) {
            console.log(err);
            socket.emit("error", {
                event: "wifi_scan_started",
                message: "Invalid JSON format",
                raw: msg,
            });
            return;
        }
    })

    //2.--------------- WIFI stream ---------------------------------------------------------------
    socket.on("scan_wifi_stream", (msg) => {
        try {
            console.log("scan_wifi_stream:", msg, "from:", socket.userId);
            const parsed =
                typeof msg === "string" ? JSON.parse(msg) : msg;

            const validated = scan_wifi_stream.safeParse(parsed);
           
            if (!validated.success) {
               console.log("VALIDATION ERROR:", validated.error);

               socket.emit("error", {
                  event: "scan_wifi_stream",
                  message: "Validation failed",
                  detail: validated.error,
               });
               return;
            }

            //const result = parsed.data;
            const result = validated.data;

            io.emit("scan_wifi_stream", result);
        } catch (err) {
            console.log(err);
            socket.emit("error", {
                event: "scan_wifi_stream",
                message: "Invalid JSON format",
                raw: msg,
            });
            return;
        }
    })

    //3.--------------- WIFI connect_wifi ---------------------------------------------------------------
    socket.on("connect_wifi", (msg) => {
        //console.log("connect_wifi:", msg, "from:", socket.userId);
        //io.emit("connect_wifi", msg);
        try {
            console.log("connect_wifi:", msg, "from:", socket.userId);
            const parsed =
                typeof msg === "string" ? JSON.parse(msg) : msg;

            const validated = connect_wifi.safeParse(parsed);
           
            if (!validated.success) {
               console.log("VALIDATION ERROR:", validated.error);

               socket.emit("error", {
                  event: "connect_wifi",
                  message: "Validation failed",
                  detail: validated.error,
               });
               return;
            }

            //const result = parsed.data;
            const result = validated.data;

            io.emit("connect_wifi", result);
        } catch (err) {
            console.log(err);
            socket.emit("error", {
                event: "connect_wifi",
                message: "Invalid JSON format",
                raw: msg,
            });
            return;
        }
    })
    
    //4.--------------- WIFI get_wifi_status ---------------------------------------------------------------
    socket.on("get_wifi_status", (msg) => {
        //console.log("get_wifi_status:", msg, "from:", socket.userId);
        //io.emit("get_wifi_status", msg);
         try {
            console.log("get_wifi_status:", msg, "from:", socket.userId);
            const parsed =
                typeof msg === "string" ? JSON.parse(msg) : msg;

            const validated = get_wifi_status.safeParse(parsed);
           
            if (!validated.success) {
               console.log("VALIDATION ERROR:", validated.error);

               socket.emit("error", {
                  event: "get_wifi_status",
                  message: "Validation failed",
                  detail: validated.error,
               });
               return;
            }

            //const result = parsed.data;
            const result = validated.data;

            io.emit("get_wifi_status", result);
        } catch (err) {
            console.log(err);
            socket.emit("error", {
                event: "get_wifi_status",
                message: "Invalid JSON format",
                raw: msg,
            });
            return;
        }
     
    })
    
    //5.--------------- WIFI disconnect_wifi ---------------------------------------------------------------
    socket.on("disconnect_wifi", (msg) => {
        //console.log("disconnect_wifi:", msg, "from:", socket.userId);
        //io.emit("disconnect_wifi", msg);
        try {
            console.log("disconnect_wifi:", msg, "from:", socket.userId);
            const parsed =
                typeof msg === "string" ? JSON.parse(msg) : msg;

            const validated = disconnect_wifi.safeParse(parsed);
           
            if (!validated.success) {
               console.log("VALIDATION ERROR:", validated.error);

               socket.emit("error", {
                  event: "disconnect_wifi",
                  message: "Validation failed",
                  detail: validated.error,
               });
               return;
            }

            //const result = parsed.data;
            const result = validated.data;

            io.emit("disconnect_wifi", result);
        } catch (err) {
            console.log(err);
            socket.emit("error", {
                event: "disconnect_wifi",
                message: "Invalid JSON format",
                raw: msg,
            });
            return;
        }

    })
    
    //6.--------------- WIFI wifi_status ---------------------------------------------------------------
    socket.on("wifi_status", (msg) => {
        //console.log("wifi_status:", msg, "from:", socket.userId);
        //io.emit("wifi_status", msg);
        try {
            console.log("wifi_status:", msg, "from:", socket.userId);
            const parsed =
                typeof msg === "string" ? JSON.parse(msg) : msg;

            const validated = wifi_status.safeParse(parsed);
           
            if (!validated.success) {
               console.log("VALIDATION ERROR:", validated.error);

               socket.emit("error", {
                  event: "wifi_status",
                  message: "Validation failed",
                  detail: validated.error,
               });
               return;
            }

            //const result = parsed.data;
            const result = validated.data;

            io.emit("wifi_status", result);
        } catch (err) {
            console.log(err);
            socket.emit("error", {
                event: "wifi_status",
                message: "Invalid JSON format",
                raw: msg,
            });
            return;
        }
    })
    
    //7.--------------- WIFI wifi_connecting ---------------------------------------------------------------   
    socket.on("wifi_connecting", (msg) => {
        //console.log("wifi_connecting:", msg, "from:", socket.userId);
        //io.emit("wifi_connecting", msg);
        try {
            console.log("wifi_connecting:", msg, "from:", socket.userId);
            const parsed =
                typeof msg === "string" ? JSON.parse(msg) : msg;

            const validated = wifi_connecting.safeParse(parsed);
           
            if (!validated.success) {
               console.log("VALIDATION ERROR:", validated.error);

               socket.emit("error", {
                  event: "wifi_connecting",
                  message: "Validation failed",
                  detail: validated.error,
               });
               return;
            }

            //const result = parsed.data;
            const result = validated.data;

            io.emit("wifi_connecting", result);
        } catch (err) {
            console.log(err);
            socket.emit("error", {
                event: "wifi_connecting",
                message: "Invalid JSON format",
                raw: msg,
            });
            return;
        }
    })
    
    //8.--------------- WIFI wifi_scan_completed ---------------------------------------------------------------   
    socket.on("wifi_scan_completed", (msg) => {
        //console.log("wifi_scan_completed:", msg, "from:", socket.userId);
        //io.emit("wifi_scan_completed", msg);
        try {
            console.log("wifi_scan_completed:", msg, "from:", socket.userId);
            const parsed =
                typeof msg === "string" ? JSON.parse(msg) : msg;

            const validated = wifi_scan_completed.safeParse(parsed);
           
            if (!validated.success) {
               console.log("VALIDATION ERROR:", validated.error);

               socket.emit("error", {
                  event: "wifi_scan_completed",
                  message: "Validation failed",
                  detail: validated.error,
               });
               return;
            }

            //const result = parsed.data;
            const result = validated.data;

            io.emit("wifi_scan_completed", result);
        } catch (err) {
            console.log(err);
            socket.emit("error", {
                event: "wifi_scan_completed",
                message: "Invalid JSON format",
                raw: msg,
            });
            return;
        }
    })
    
    //9.--------------- WIFI wifi_network_found ---------------------------------------------------------------
    socket.on("wifi_network_found", (msg) => {
        //console.log("wifi_network_found:", msg, "from:", socket.userId);
        //io.emit("wifi_network_found", msg);
        try {
            console.log("wifi_network_found:", msg, "from:", socket.userId);
            const parsed =
                typeof msg === "string" ? JSON.parse(msg) : msg;

            const validated = wifi_network_found.safeParse(parsed);
           
            if (!validated.success) {
               console.log("VALIDATION ERROR:", validated.error);

               socket.emit("error", {
                  event: "wifi_network_found",
                  message: "Validation failed",
                  detail: validated.error,
               });
               return;
            }

            //const result = parsed.data;
            const result = validated.data;

            io.emit("wifi_network_found", result);
        } catch (err) {
            console.log(err);
            socket.emit("error", {
                event: "wifi_network_found",
                message: "Invalid JSON format",
                raw: msg,
            });
            return;
        }

    })
    
    //10.--------------- WIFI wifi_connection_progress ---------------------------------------------------------------
    socket.on("wifi_connection_progress", (msg) => {
        //console.log("wifi_connection_progress:", msg, "from:", socket.userId);
        //io.emit("wifi_connection_progress", msg);
        try {
            console.log("wifi_connection_progress:", msg, "from:", socket.userId);
            const parsed =
                typeof msg === "string" ? JSON.parse(msg) : msg;

            const validated = wifi_connection_progress.safeParse(parsed);
           
            if (!validated.success) {
               console.log("VALIDATION ERROR:", validated.error);

               socket.emit("error", {
                  event: "wifi_connection_progress",
                  message: "Validation failed",
                  detail: validated.error,
               });
               return;
            }

            //const result = parsed.data;
            const result = validated.data;

            io.emit("wifi_connection_progress", result);
        } catch (err) {
            console.log(err);
            socket.emit("error", {
                event: "wifi_connection_progress",
                message: "Invalid JSON format",
                raw: msg,
            });
            return;
        }
    })
    
    //11.--------------- WIFI wifi_connected ---------------------------------------------------------------
    socket.on("wifi_connected", (msg) => {
        //console.log("wifi_connected:", msg, "from:", socket.userId);
        //io.emit("wifi_connected", msg);
        try {
            console.log("wifi_connected:", msg, "from:", socket.userId);
            const parsed =
                typeof msg === "string" ? JSON.parse(msg) : msg;

            const validated = wifi_connected.safeParse(parsed);
           
            if (!validated.success) {
               console.log("VALIDATION ERROR:", validated.error);

               socket.emit("error", {
                  event: "wifi_connected",
                  message: "Validation failed",
                  detail: validated.error,
               });
               return;
            }

            //const result = parsed.data;
            const result = validated.data;

            io.emit("wifi_connected", result);
        } catch (err) {
            console.log(err);
            socket.emit("error", {
                event: "wifi_connected",
                message: "Invalid JSON format",
                raw: msg,
            });
            return;
        }
    })
    
    //12.--------------- WIFI wifi_connection_failed ---------------------------------------------------------------
    socket.on("wifi_connection_failed", (msg) => {
        //console.log("wifi_connection_failed:", msg, "from:", socket.userId);
        //io.emit("wifi_connection_failed", msg);
        try {
            console.log("wifi_connection_failed:", msg, "from:", socket.userId);
            const parsed =
                typeof msg === "string" ? JSON.parse(msg) : msg;

            const validated = wifi_connection_failed.safeParse(parsed);
           
            if (!validated.success) {
               console.log("VALIDATION ERROR:", validated.error);

               socket.emit("error", {
                  event: "wifi_connection_failed",
                  message: "Validation failed",
                  detail: validated.error,
               });
               return;
            }

            //const result = parsed.data;
            const result = validated.data;

            io.emit("wifi_connection_failed", result);
        } catch (err) {
            console.log(err);
            socket.emit("error", {
                event: "wifi_connection_failed",
                message: "Invalid JSON format",
                raw: msg,
            });
            return;
        }
    })
    
    //13.--------------- WIFI wifi_disconnected ---------------------------------------------------------------
    socket.on("wifi_disconnected", (msg) => {
        //console.log("wifi_disconnected:", msg, "from:", socket.userId);
        //io.emit("wifi_disconnected", msg);
        try {
            console.log("wifi_disconnected:", msg, "from:", socket.userId);
            const parsed =
                typeof msg === "string" ? JSON.parse(msg) : msg;

            const validated = wifi_disconnected.safeParse(parsed);
           
            if (!validated.success) {
               console.log("VALIDATION ERROR:", validated.error);

               socket.emit("error", {
                  event: "wifi_disconnected",
                  message: "Validation failed",
                  detail: validated.error,
               });
               return;
            }

            //const result = parsed.data;
            const result = validated.data;

            io.emit("wifi_disconnected", result);
        } catch (err) {
            console.log(err);
            socket.emit("error", {
                event: "wifi_disconnected",
                message: "Invalid JSON format",
                raw: msg,
            });
            return;
        }
    })
    
    //14.--------------- WIFI wifi_error ---------------------------------------------------------------
    socket.on("wifi_error", (msg) => {
        //console.log("wifi_error:", msg, "from:", socket.userId);
        //io.emit("wifi_error", msg);
        try {
            console.log("wifi_error:", msg, "from:", socket.userId);
            const parsed =
                typeof msg === "string" ? JSON.parse(msg) : msg;

            const validated = wifi_error.safeParse(parsed);
           
            if (!validated.success) {
               console.log("VALIDATION ERROR:", validated.error);

               socket.emit("error", {
                  event: "wifi_error",
                  message: "Validation failed",
                  detail: validated.error,
               });
               return;
            }

            //const result = parsed.data;
            const result = validated.data;

            io.emit("wifi_error", result);
        } catch (err) {
            console.log(err);
            socket.emit("error", {
                event: "wifi_error",
                message: "Invalid JSON format",
                raw: msg,
            });
            return;
        }
    })
    
    //15.--------------- WIFI tz_info ---------------------------------------------------------------
    socket.on("tz_info", (msg) => {
        //console.log("tz_info:", msg, "from:", socket.userId);
        //io.emit("tz_info", msg);
        try {
            console.log("tz_info:", msg, "from:", socket.userId);
            const parsed =
                typeof msg === "string" ? JSON.parse(msg) : msg;

            const validated = tz_info.safeParse(parsed);
           
            if (!validated.success) {
               console.log("VALIDATION ERROR:", validated.error);

               socket.emit("error", {
                  event: "tz_info",
                  message: "Validation failed",
                  detail: validated.error,
               });
               return;
            }

            //const result = parsed.data;
            const result = validated.data;

            io.emit("tz_info", result);
        } catch (err) {
            console.log(err);
            socket.emit("error", {
                event: "tz_info",
                message: "Invalid JSON format",
                raw: msg,
            });
            return;
        }
    })
    
    //16.--------------- WIFI v ---------------------------------------------------------------
    socket.on("tz_ret", (msg) => {
        //console.log("tz_ret:", msg, "from:", socket.userId);
        //io.emit("tz_ret", msg);
        try {
            console.log("tz_ret:", msg, "from:", socket.userId);
            const parsed =
                typeof msg === "string" ? JSON.parse(msg) : msg;

            const validated = tz_ret.safeParse(parsed);
           
            if (!validated.success) {
               console.log("VALIDATION ERROR:", validated.error);

               socket.emit("error", {
                  event: "tz_ret",
                  message: "Validation failed",
                  detail: validated.error,
               });
               return;
            }

            //const result = parsed.data;
            const result = validated.data;

            io.emit("tz_ret", result);
        } catch (err) {
            console.log(err);
            socket.emit("error", {
                event: "tz_ret",
                message: "Invalid JSON format",
                raw: msg,
            });
            return;
        }
    })
}
