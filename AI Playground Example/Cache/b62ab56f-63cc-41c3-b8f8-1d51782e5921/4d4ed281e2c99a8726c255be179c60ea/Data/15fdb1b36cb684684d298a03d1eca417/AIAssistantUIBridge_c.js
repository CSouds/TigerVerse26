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
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">AIAssistantUIBridge – AI assistant to UI bridge</span><br/><span style=\"color: #94A3B8; font-size: 11px;\">Connects AI assistants (Gemini Live, OpenAI Realtime) to the Sphere Controller UI.</span>"}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Assistants</span>"}
// @ui {"widget":"group_start", "label":"Assistants"}
// @input AssignableType geminiAssistant {"hint":"GeminiAssistant component for Gemini Live interactions"}
// @input AssignableType_1 openAIAssistant {"hint":"OpenAIAssistant component for OpenAI Realtime interactions"}
// @ui {"widget":"group_end"}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">UI Elements</span>"}
// @ui {"widget":"group_start", "label":"UI Elements"}
// @input AssignableType_2 sphereController {"hint":"SphereController managing the orb UI and hand tracking"}
// @input AssignableType_3 snap3DInteractableFactory {"hint":"Factory for creating interactable Snap3D scene objects"}
// @input Component.Text hintTitle {"hint":"Text element displaying the hint title"}
// @input Component.Text hintText {"hint":"Text element displaying hint instructions to the user"}
// @input AssignableType_4 geminiButton {"hint":"Button that activates the Gemini assistant"}
// @input AssignableType_5 openAIButton {"hint":"Button that activates the OpenAI assistant"}
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
var Module = require("../../../../Modules/Src/Assets/Scripts/AIAssistantUIBridge");
Object.setPrototypeOf(script, Module.AIAssistantUIBridge.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("geminiAssistant", []);
    checkUndefined("openAIAssistant", []);
    checkUndefined("sphereController", []);
    checkUndefined("snap3DInteractableFactory", []);
    checkUndefined("hintTitle", []);
    checkUndefined("hintText", []);
    checkUndefined("geminiButton", []);
    checkUndefined("openAIButton", []);
    checkUndefined("enableLogging", []);
    checkUndefined("enableLoggingLifecycle", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
