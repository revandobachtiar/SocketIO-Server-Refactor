
import robotHandlers from "./identity.ts"
import incidentHandlers from "./fall-detection.ts"
import speechModuleListener from "./speech-module-listener"
import robotModeHandlers from "./robotMode"
import alarmHandlers from "./alarm"
import languageSetupHandlers from "./language-setup.ts"
import wifiModuleHandler from "./wifi-setup"
import volumeModuleHandler from "./volume.ts" 
import brightnessModuleHandler from "./brightness"

export default function registerHandlers(socket : any,io: any){
    robotHandlers(socket,io);
    incidentHandlers(socket,io);
    speechModuleListener(socket,io);
    robotModeHandlers(socket,io);
    alarmHandlers(socket,io)
    languageSetupHandlers(socket,io);
    alarmHandlers(socket,io);
    wifiModuleHandler(socket,io)
    volumeModuleHandler(socket,io)
    brightnessModuleHandler(socket,io)
}