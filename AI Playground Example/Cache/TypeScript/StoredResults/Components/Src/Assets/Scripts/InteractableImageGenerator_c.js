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
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">InteractableImageGenerator – text-to-image generation</span><br/><span style=\"color: #94A3B8; font-size: 11px;\">Generates images from ASR voice queries using OpenAI or Gemini image APIs.</span>"}
// @ui {"widget":"separator"}
// @input string modelProvider = "OpenAI" {"hint":"AI provider used for image generation", "widget":"combobox", "values":[{"label":"OpenAI", "value":"OpenAI"}, {"label":"Gemini", "value":"Gemini"}]}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">UI References</span>"}
// @input Component.Image image {"hint":"Image component where the generated texture will be displayed"}
// @input Component.Text textDisplay {"hint":"Text element showing the current generation status or prompt"}
// @input AssignableType asrQueryController {"hint":"ASRQueryController that fires voice query events"}
// @input SceneObject spinner {"hint":"SceneObject shown as a loading spinner during generation"}
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
var Module = require("../../../../Modules/Src/Assets/Scripts/InteractableImageGenerator");
Object.setPrototypeOf(script, Module.InteractableImageGenerator.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("modelProvider", []);
    checkUndefined("image", []);
    checkUndefined("textDisplay", []);
    checkUndefined("asrQueryController", []);
    checkUndefined("spinner", []);
    checkUndefined("enableLogging", []);
    checkUndefined("enableLoggingLifecycle", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
