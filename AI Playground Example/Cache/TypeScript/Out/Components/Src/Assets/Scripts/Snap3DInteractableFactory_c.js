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
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Snap3DInteractableFactory – 3D object generation factory</span><br/><span style=\"color: #94A3B8; font-size: 11px;\">Creates interactable Snap3D objects from text prompts and manages the generation lifecycle.</span>"}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Generation Settings</span>"}
// @ui {"widget":"group_start", "label":"Submit and Get Status Example"}
// @input string prompt = "A cute dog wearing a hat" {"hint":"Default text prompt used when running via tap (overridden when called programmatically)", "widget":"text_area"}
// @input bool refineMesh = true {"hint":"Run the mesh refinement pass for higher quality output"}
// @input bool useVertexColor {"hint":"Use vertex color instead of a UV-mapped texture on the generated mesh"}
// @ui {"widget":"group_end"}
// @input bool runOnTap {"hint":"Generate a 3D object when the scene is tapped (useful for quick testing)"}
// @input Asset.ObjectPrefab snap3DInteractablePrefab {"hint":"Prefab instantiated for each generated 3D object — must have a Snap3DInteractable component"}
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
var Module = require("../../../../Modules/Src/Assets/Scripts/Snap3DInteractableFactory");
Object.setPrototypeOf(script, Module.Snap3DInteractableFactory.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("prompt", []);
    checkUndefined("refineMesh", []);
    checkUndefined("useVertexColor", []);
    checkUndefined("runOnTap", []);
    checkUndefined("snap3DInteractablePrefab", []);
    checkUndefined("enableLogging", []);
    checkUndefined("enableLoggingLifecycle", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
