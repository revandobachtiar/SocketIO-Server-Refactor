
import robotHandlers from "./identity.ts"
import incidentHandlers from "./fall-detection.ts"
import speechModuleListener from "./speech-module-listener"
import robotModeHandlers from "./robotMode"
import alarmHandlers from "./alarm"
import languageSetupHandlers from "./language-setup.ts"

export default function registerHandlers(socket,io){
    robotHandlers(socket,io);
    incidentHandlers(socket,io);
    speechModuleListener(socket,io);
    robotModeHandlers(socket,io);
    alarmHandlers(socket,io)
    languageSetupHandlers(socket,io);
}