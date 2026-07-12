
import alarmHandler from "./alarm-handler.ts";
import brightnessHandler from "./brightness-handler.ts";
import fallDetectionHandler from "./fall-detection-handler.ts";
import robotHandlers from "./identity.ts"
import languageSetupHandler from "./language-setup-handler.ts";
import robotModeHandler from "./robot-mode-handler";
import voiceCommandHandler from "./voice-command-handler.ts";
import volumeHandler from "./volume-handler.ts";
import wifiSetupHandler from "./wifi-setup-handler.ts";

export default function registerHandlers(socket : any,io: any){
    robotHandlers(socket,io);
    fallDetectionHandler(socket,io);
    alarmHandler(socket,io);
    brightnessHandler(socket,io)
    languageSetupHandler(socket,io);
    robotModeHandler(socket,io);
    voiceCommandHandler(socket,io)
    volumeHandler(socket,io)
    wifiSetupHandler(socket,io)
}