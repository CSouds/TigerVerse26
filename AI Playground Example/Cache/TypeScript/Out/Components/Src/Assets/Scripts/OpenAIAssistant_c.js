if (script.onAwake) {
    script.onAwake();
    return;
}
function checkUndefined(property, showIfData) {
    for (var i = 0; i < showIfData.length; i++) {
        if (showIfData[i][0] && script[showIfData[i][0]] != showIfData[i][1]) {
            return;
        }
    }
    if (script[property] == undefined) {
        throw new Error("Input " + property + " was not provided for the object " + script.getSceneObject().name);
    }
}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">OpenAIAssistant – OpenAI Realtime connection</span><br/><span style=\"color: #94A3B8; font-size: 11px;\">Connects to the OpenAI Realtime API via WebSocket for real-time audio streaming and function calls.</span>"}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Setup</span>"}
// @ui {"widget":"group_start", "label":"Setup"}
// @input SceneObject websocketRequirementsObj {"hint":"SceneObject that enables the WebSocket requirements when the session starts"}
// @input AssignableType dynamicAudioOutput {"hint":"DynamicAudioOutput component for PCM16 audio playback"}
// @input AssignableType_1 microphoneRecorder {"hint":"MicrophoneRecorder component for capturing microphone input"}
// @ui {"widget":"group_end"}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Inputs</span>"}
// @ui {"widget":"group_start", "label":"Inputs"}
// @input string instructions = "You are a helpful assistant that loves to make puns" {"hint":"System instruction text sent to OpenAI on session setup", "widget":"text_area"}
// @ui {"widget":"group_end"}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Outputs</span>"}
// @ui {"widget":"group_start", "label":"Outputs"}
// @ui {"widget":"label", "label":"<span style=\"color: yellow;\">⚠️ To prevent audio feedback loop in Lens Studio Editor, use headphones or manage your microphone input.</span>"}
// @input bool haveAudioOutput {"hint":"Enable audio output from OpenAI responses"}
// @input string voice = "coral" {"hint":"Voice name for OpenAI audio output", "widget":"combobox", "values":[{"label":"alloy", "value":"alloy"}, {"label":"ash", "value":"ash"}, {"label":"ballad", "value":"ballad"}, {"label":"coral", "value":"coral"}, {"label":"echo", "value":"echo"}, {"label":"sage", "value":"sage"}, {"label":"shimmer", "value":"shimmer"}, {"label":"verse", "value":"verse"}], "showIf":"haveAudioOutput", "showIfValue":true}
// @ui {"widget":"group_end"}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Logging</span>"}
// @input bool enableLogging {"hint":"Enable general logging"}
// @input bool enableLoggingLifecycle {"hint":"Enable lifecycle logging (onAwake, onStart, onUpdate, onDestroy)"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../Modules/Src/Assets/Scripts/OpenAIAssistant");
Object.setPrototypeOf(script, Module.OpenAIAssistant.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("websocketRequirementsObj", []);
    checkUndefined("dynamicAudioOutput", []);
    checkUndefined("microphoneRecorder", []);
    checkUndefined("instructions", []);
    checkUndefined("haveAudioOutput", []);
    checkUndefined("voice", [["haveAudioOutput",true]]);
    checkUndefined("enableLogging", []);
    checkUndefined("enableLoggingLifecycle", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
