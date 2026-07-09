
import robotHandlers from "./identity.ts"
import incidentHandlers from "./fall-detection.ts"
import speechModuleListener from "./led-module.ts"
import robotModeHandlers from "./robotMode.ts"
import alarmHandlers from "./alarm.ts"
import languageSetupHandlers from "./language-setup.ts"
import wifiModuleHandler from "./wifi-setup.ts"
import volumeModuleHandler from "./volume.ts" 
import brightnessModuleHandler from "./brightness.ts"
import voiceCommandHandler from "./voice-command.ts"

export default function registerHandlers(socket : any,io: any){
    robotHandlers(socket,io);
    incidentHandlers(socket,io);
    speechModuleListener(socket,io);
    robotModeHandlers(socket,io);
    alarmHandlers(socket,io)
    languageSetupHandlers(socket,io);
    alarmHandlers(socket,io);
    wifiModuleHandler(socket,io);
    volumeModuleHandler(socket,io);
    brightnessModuleHandler(socket,io);
    voiceCommandHandler(socket,io);
}               