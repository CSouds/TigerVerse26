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
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Snap3DInteractable – 3D generation result viewer</span><br/><span style=\"color: #94A3B8; font-size: 11px;\">Receives image and mesh data from the factory and renders them on an interactable scene object.</span>"}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">References</span>"}
// @input SceneObject modelParent {"hint":"Parent SceneObject where the instantiated 3D model will be placed"}
// @input Component.Image img {"hint":"Image component used to display the preview image while the model loads"}
// @input Component.Text promptDisplay {"hint":"Text element displaying the generation prompt"}
// @input SceneObject spinner {"hint":"SceneObject shown as a loading spinner during generation"}
// @input Asset.Material mat {"hint":"Material applied to the instantiated 3D model"}
// @input SceneObject displayPlate {"hint":"SceneObject containing the display plate UI element"}
// @input SceneObject colliderObj {"hint":"SceneObject whose scale defines the collision boundary"}
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
var Module = require("../../../../Modules/Src/Assets/Scripts/Snap3DInteractable");
Object.setPrototypeOf(script, Module.Snap3DInteractable.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("modelParent", []);
    checkUndefined("img", []);
    checkUndefined("promptDisplay", []);
    checkUndefined("spinner", []);
    checkUndefined("mat", []);
    checkUndefined("displayPlate", []);
    checkUndefined("colliderObj", []);
    checkUndefined("enableLogging", []);
    checkUndefined("enableLoggingLifecycle", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
