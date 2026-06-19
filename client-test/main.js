import { io } from "socket.io-client";

const socket = io("http://localhost:4000", {
  transports: ["websocket"],
  timeout: 5000,
});

// ACK EVENTS LIST

const ACK_EVENTS = [
  "INCIDENT_FALL_DOWN_DETECTED",
  "INCIDENT_FALL_DOWN_NO_RESPONSE",
  "INCIDENT_HELP_EVENT_DETECTED",
  "INCIDENT_NOT_OK_EVENT_DETECTED",
  "ALARM_SET",
  "ALARM_RING",
  "ALARM_STOP",
  "DEVICE_OFF",
  "DEVICE_READY",
  "DEVICE_RESET",
  "DEVICE_RESTART",
  "PING_DEVICE_UP",
  "DEVICE_CONFIGURE",
  "REMINDER_NOTIFY",
];

// CONNECTION

socket.on("connect", async () => {
  console.log("Connected:", socket.id);

  for (const eventName of ACK_EVENTS) {
    await emitWithAck(eventName, {
      test: true,
      timestamp: Date.now(),
    });
  }

  console.log("All ACK_EVENTS tested");
  socket.disconnect();
});

// EMIT WITH ACK + TIMEOUT

function emitWithAck(eventName, payload) {
  return new Promise((resolve) => {
    console.log(`Emit: ${eventName}`);

    socket
      .timeout(3000)
      .emit(eventName, payload, (err, ack) => {
        if (err) {
          console.error(`ACK timeout: ${eventName}`);
          return resolve(null);
        }

        console.log(`ACK received [${eventName}]:`, ack);
        resolve(ack);
      });
  });
}

// ERROR HANDLING

socket.on("disconnect", () => {
  console.log("Disconnected");
});

socket.on("connect_error", (err) => {
  console.error("Connection error:", err.message);
});
