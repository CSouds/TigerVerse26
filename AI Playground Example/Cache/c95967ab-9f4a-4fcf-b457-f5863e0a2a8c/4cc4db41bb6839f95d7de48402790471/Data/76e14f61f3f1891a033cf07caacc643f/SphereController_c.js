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
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">SphereController – AI assistant orb UI</span><br/><span style=\"color: #94A3B8; font-size: 11px;\">Manages the orb that follows the user's hand, can be placed in the world, and supports screen-space fallback.</span>"}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Materials</span>"}
// @input Asset.Material hoverMat {"hint":"Material driving the hover highlight effect on the orb"}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Scene References</span>"}
// @input SceneObject orbInteractableObj {"hint":"SceneObject holding the Interactable, InteractableManipulation and PinchButton components"}
// @input SceneObject orbObject {"hint":"Root SceneObject of the orb that is scaled and positioned in world space"}
// @input SceneObject orbVisualParent {"hint":"Visual child of the orb reparented between world and screen space"}
// @input SceneObject orbScreenPosition {"hint":"Screen-space anchor SceneObject used when the orb is outside the field of view"}
// @input SceneObject closeObj {"hint":"SceneObject containing the close button and its animations"}
// @input Component.Text worldSpaceText {"hint":"Text element shown in world space for AI output"}
// @input Component.Text screenSpaceText {"hint":"Text element shown in screen space when the orb is off-screen"}
// @input SceneObject uiParent {"hint":"Parent SceneObject for all UI elements, hidden until the session starts"}
// @input AssignableType closeButton {"hint":"Button used to return the orb to hand-tracking mode"}
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
var Module = require("../../../../Modules/Src/Assets/Scripts/SphereController");
Object.setPrototypeOf(script, Module.SphereController.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("hoverMat", []);
    checkUndefined("orbInteractableObj", []);
    checkUndefined("orbObject", []);
    checkUndefined("orbVisualParent", []);
    checkUndefined("orbScreenPosition", []);
    checkUndefined("closeObj", []);
    checkUndefined("worldSpaceText", []);
    checkUndefined("screenSpaceText", []);
    checkUndefined("uiParent", []);
    checkUndefined("closeButton", []);
    checkUndefined("enableLogging", []);
    checkUndefined("enableLoggingLifecycle", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
