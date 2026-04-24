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
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">InteractableSnap3DGenerator – voice-driven 3D generation</span><br/><span style=\"color: #94A3B8; font-size: 11px;\">Connects ASR voice queries to the Snap3D factory to generate 3D objects in the scene.</span>"}
// @ui {"widget":"separator"}
// @input AssignableType snap3DFactory {"hint":"Snap3DInteractableFactory used to create 3D objects from text prompts"}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">References</span>"}
// @input AssignableType_1 asrQueryController {"hint":"ASRQueryController that fires voice query events"}
// @input SceneObject targetPosition {"hint":"SceneObject whose world position is used as the spawn target for generated objects"}
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
var Module = require("../../../../Modules/Src/Assets/Scripts/InteractableSnap3DGenerator");
Object.setPrototypeOf(script, Module.InteractableImageGenerator.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("snap3DFactory", []);
    checkUndefined("asrQueryController", []);
    checkUndefined("targetPosition", []);
    checkUndefined("enableLogging", []);
    checkUndefined("enableLoggingLifecycle", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
