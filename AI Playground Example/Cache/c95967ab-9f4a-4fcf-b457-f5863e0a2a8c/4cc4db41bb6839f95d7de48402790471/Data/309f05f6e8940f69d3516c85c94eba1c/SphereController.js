"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SphereController = void 0;
var __selfType = requireType("./SphereController");
function component(target) {
    target.getTypeName = function () { return __selfType; };
    if (target.prototype.hasOwnProperty("getTypeName"))
        return;
    Object.defineProperty(target.prototype, "getTypeName", {
        value: function () { return __selfType; },
        configurable: true,
        writable: true
    });
}
/**
 * Specs Inc. 2026
 * Sphere Controller for the AI Playground Spectacles lens experience.
 */
const Interactable_1 = require("SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable");
const InteractableManipulation_1 = require("SpectaclesInteractionKit.lspkg/Components/Interaction/InteractableManipulation/InteractableManipulation");
const animate_1 = require("SpectaclesInteractionKit.lspkg/Utils/animate");
const PinchButton_1 = require("SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton");
const WorldCameraFinderProvider_1 = require("SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider");
const HandInputData_1 = require("SpectaclesInteractionKit.lspkg/Providers/HandInputData/HandInputData");
const Event_1 = require("SpectaclesInteractionKit.lspkg/Utils/Event");
const decorators_1 = require("SnapDecorators.lspkg/decorators");
const Logger_1 = require("Utilities.lspkg/Scripts/Utils/Logger");
const MathUtils_1 = require("Utilities.lspkg/Scripts/Utils/MathUtils");
let SphereController = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    let _instanceExtraInitializers = [];
    let _init_decorators;
    let _onUpdate_decorators;
    var SphereController = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.hoverMat = (__runInitializers(this, _instanceExtraInitializers), this.hoverMat);
            this.orbInteractableObj = this.orbInteractableObj;
            this.orbObject = this.orbObject;
            this.orbVisualParent = this.orbVisualParent;
            this.orbScreenPosition = this.orbScreenPosition;
            this.closeObj = this.closeObj;
            this.worldSpaceText = this.worldSpaceText;
            this.screenSpaceText = this.screenSpaceText;
            this.uiParent = this.uiParent;
            this.closeButton = this.closeButton;
            this.enableLogging = this.enableLogging;
            this.enableLoggingLifecycle = this.enableLoggingLifecycle;
            this.wasInFOV = true;
            this.handProvider = HandInputData_1.HandInputData.getInstance();
            this.menuHand = this.handProvider.getHand("left");
            this.trackedToHand = true;
            this.wcfmp = WorldCameraFinderProvider_1.default.getInstance();
            this.minimizedSize = vec3.one().uniformScale(0.3);
            this.fullSize = vec3.one();
            this.isActivatedEvent = new Event_1.default();
        }
        __initialize() {
            super.__initialize();
            this.hoverMat = (__runInitializers(this, _instanceExtraInitializers), this.hoverMat);
            this.orbInteractableObj = this.orbInteractableObj;
            this.orbObject = this.orbObject;
            this.orbVisualParent = this.orbVisualParent;
            this.orbScreenPosition = this.orbScreenPosition;
            this.closeObj = this.closeObj;
            this.worldSpaceText = this.worldSpaceText;
            this.screenSpaceText = this.screenSpaceText;
            this.uiParent = this.uiParent;
            this.closeButton = this.closeButton;
            this.enableLogging = this.enableLogging;
            this.enableLoggingLifecycle = this.enableLoggingLifecycle;
            this.wasInFOV = true;
            this.handProvider = HandInputData_1.HandInputData.getInstance();
            this.menuHand = this.handProvider.getHand("left");
            this.trackedToHand = true;
            this.wcfmp = WorldCameraFinderProvider_1.default.getInstance();
            this.minimizedSize = vec3.one().uniformScale(0.3);
            this.fullSize = vec3.one();
            this.isActivatedEvent = new Event_1.default();
        }
        onAwake() {
            this.logger = new Logger_1.Logger("SphereController", this.enableLogging || this.enableLoggingLifecycle, true);
            if (this.enableLoggingLifecycle)
                this.logger.debug("LIFECYCLE: onAwake()");
            this.interactable = this.orbInteractableObj.getComponent(Interactable_1.Interactable.getTypeName());
            this.manipulate = this.orbInteractableObj.getComponent(InteractableManipulation_1.InteractableManipulation.getTypeName());
            this.orbButton = this.orbInteractableObj.getComponent(PinchButton_1.PinchButton.getTypeName());
            this.setIsTrackedToHand(true);
            this.hoverMat.mainPass.activeHover = 0;
            this.uiParent.enabled = false;
        }
        initializeUI() {
            this.uiParent.enabled = true;
        }
        setIsTrackedToHand(value) {
            this.trackedToHand = value;
            this.manipulate.enabled = !value;
            if (value) {
                this.setOrbToScreenPosition(true);
                {
                    const tr = this.orbObject.getTransform();
                    const start = tr.getLocalScale();
                    const end = this.minimizedSize;
                    (0, animate_1.default)({
                        duration: 0.6,
                        easing: "ease-in-out-quad",
                        update: (t) => {
                            tr.setLocalScale(new vec3(MathUtils_1.MathUtils.lerp(start.x, end.x, t), MathUtils_1.MathUtils.lerp(start.y, end.y, t), MathUtils_1.MathUtils.lerp(start.z, end.z, t)));
                        }
                    });
                }
                {
                    const tr = this.closeObj.getTransform();
                    const start = tr.getLocalScale();
                    const end = vec3.one().uniformScale(0.1);
                    (0, animate_1.default)({
                        duration: 0.6,
                        easing: "ease-in-out-quad",
                        update: (t) => {
                            tr.setLocalScale(new vec3(MathUtils_1.MathUtils.lerp(start.x, end.x, t), MathUtils_1.MathUtils.lerp(start.y, end.y, t), MathUtils_1.MathUtils.lerp(start.z, end.z, t)));
                        },
                        ended: () => {
                            this.closeButton.sceneObject.enabled = false;
                        }
                    });
                }
                this.screenSpaceText.enabled = false;
                this.worldSpaceText.enabled = false;
            }
            else {
                {
                    const tr = this.orbObject.getTransform();
                    const start = tr.getLocalScale();
                    const end = this.fullSize;
                    (0, animate_1.default)({
                        duration: 0.4,
                        easing: "ease-in-out-quad",
                        update: (t) => {
                            tr.setLocalScale(new vec3(MathUtils_1.MathUtils.lerp(start.x, end.x, t), MathUtils_1.MathUtils.lerp(start.y, end.y, t), MathUtils_1.MathUtils.lerp(start.z, end.z, t)));
                        }
                    });
                }
                {
                    const tr = this.orbObject.getTransform();
                    const start = tr.getWorldPosition();
                    const end = this.wcfmp.getForwardPosition(100);
                    (0, animate_1.default)({
                        duration: 0.6,
                        easing: "ease-in-out-quad",
                        update: (t) => {
                            tr.setWorldPosition(new vec3(MathUtils_1.MathUtils.lerp(start.x, end.x, t), MathUtils_1.MathUtils.lerp(start.y, end.y, t), MathUtils_1.MathUtils.lerp(start.z, end.z, t)));
                        }
                    });
                }
                this.closeButton.sceneObject.enabled = true;
                {
                    const tr = this.closeObj.getTransform();
                    const start = tr.getLocalScale();
                    const end = vec3.one();
                    (0, animate_1.default)({
                        duration: 0.6,
                        easing: "ease-in-out-quad",
                        update: (t) => {
                            tr.setLocalScale(new vec3(MathUtils_1.MathUtils.lerp(start.x, end.x, t), MathUtils_1.MathUtils.lerp(start.y, end.y, t), MathUtils_1.MathUtils.lerp(start.z, end.z, t)));
                        }
                    });
                }
                this.screenSpaceText.enabled = false;
                this.worldSpaceText.enabled = true;
            }
            this.isActivatedEvent.invoke(!value);
        }
        init() {
            if (this.enableLoggingLifecycle)
                this.logger.debug("LIFECYCLE: onStart()");
            this.interactable.onHoverEnter.add(() => {
                (0, animate_1.default)({
                    duration: 0.2,
                    easing: "linear",
                    update: (t) => {
                        this.hoverMat.mainPass.activeHover = t;
                    }
                });
            });
            this.interactable.onHoverExit.add(() => {
                (0, animate_1.default)({
                    duration: 0.2,
                    easing: "linear",
                    update: (t) => {
                        this.hoverMat.mainPass.activeHover = 1 - t;
                    }
                });
            });
            this.orbButton.onButtonPinched.add(() => {
                if (this.trackedToHand) {
                    this.setIsTrackedToHand(false);
                }
            });
            this.closeButton.onInitialized.add(() => {
                this.closeButton.onTriggerUp.add(() => {
                    if (!this.trackedToHand) {
                        this.setIsTrackedToHand(true);
                    }
                });
            });
        }
        onUpdate() {
            this.positionByHand();
            this.keepActiveOrbVisible();
        }
        positionByHand() {
            let objectToTransform = this.orbObject.getTransform();
            if (!this.trackedToHand) {
                objectToTransform = this.closeObj.getTransform();
            }
            const handPosition = this.menuHand.pinkyKnuckle.position;
            const handRight = this.menuHand.indexTip.right;
            const curPosition = objectToTransform.getWorldPosition();
            let menuPosition = handPosition.add(handRight.uniformScale(4));
            if (global.deviceInfoSystem.isEditor()) {
                menuPosition = this.wcfmp.getWorldPosition().add(new vec3(0, -20, -25));
            }
            const nPosition = vec3.lerp(curPosition, menuPosition, 0.2);
            objectToTransform.setWorldPosition(nPosition);
            let billboardPos = this.wcfmp.getWorldPosition().add(this.wcfmp.forward().uniformScale(5));
            billboardPos = billboardPos.add(this.wcfmp.right().uniformScale(-5));
            const dir = billboardPos.sub(menuPosition).normalize();
            objectToTransform.setWorldRotation(quat.lookAt(dir, vec3.up()));
            if ((!this.menuHand.isTracked() || !this.menuHand.isFacingCamera()) && !global.deviceInfoSystem.isEditor()) {
                objectToTransform.getSceneObject().enabled = false;
            }
            else {
                objectToTransform.getSceneObject().enabled = true;
            }
        }
        setOrbToScreenPosition(inScrPos) {
            if (!inScrPos) {
                this.orbVisualParent.setParent(this.orbScreenPosition);
                this.orbVisualParent.getTransform().setLocalPosition(vec3.zero());
                {
                    const tr = this.orbVisualParent.getTransform();
                    const start = vec3.one().uniformScale(0.01);
                    const end = vec3.one().uniformScale(0.3);
                    (0, animate_1.default)({
                        duration: 0.2,
                        easing: "linear",
                        update: (t) => {
                            tr.setLocalScale(new vec3(MathUtils_1.MathUtils.lerp(start.x, end.x, t), MathUtils_1.MathUtils.lerp(start.y, end.y, t), MathUtils_1.MathUtils.lerp(start.z, end.z, t)));
                        }
                    });
                }
                this.screenSpaceText.enabled = true;
                this.worldSpaceText.enabled = false;
            }
            else {
                this.orbVisualParent.setParent(this.orbObject);
                this.orbVisualParent.getTransform().setLocalPosition(vec3.zero());
                {
                    const tr = this.orbVisualParent.getTransform();
                    const start = tr.getLocalScale();
                    const end = vec3.one();
                    (0, animate_1.default)({
                        duration: 0.2,
                        easing: "linear",
                        update: (t) => {
                            tr.setLocalScale(new vec3(MathUtils_1.MathUtils.lerp(start.x, end.x, t), MathUtils_1.MathUtils.lerp(start.y, end.y, t), MathUtils_1.MathUtils.lerp(start.z, end.z, t)));
                        }
                    });
                }
                this.screenSpaceText.enabled = false;
                this.worldSpaceText.enabled = true;
            }
        }
        keepActiveOrbVisible() {
            if (this.trackedToHand) {
                return;
            }
            const orbPos = this.orbObject.getTransform().getWorldPosition();
            const inFov = this.wcfmp.inFoV(orbPos);
            if (inFov !== this.wasInFOV) {
                this.setOrbToScreenPosition(inFov);
            }
            this.wasInFOV = inFov;
        }
        setText(data) {
            if (data.completed) {
                this.worldSpaceText.text = data.text;
                this.screenSpaceText.text = data.text;
            }
            else {
                this.worldSpaceText.text += data.text;
                this.screenSpaceText.text += data.text;
            }
        }
    };
    __setFunctionName(_classThis, "SphereController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _init_decorators = [decorators_1.bindStartEvent];
        _onUpdate_decorators = [decorators_1.bindUpdateEvent];
        __esDecorate(_classThis, null, _init_decorators, { kind: "method", name: "init", static: false, private: false, access: { has: obj => "init" in obj, get: obj => obj.init }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _onUpdate_decorators, { kind: "method", name: "onUpdate", static: false, private: false, access: { has: obj => "onUpdate" in obj, get: obj => obj.onUpdate }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SphereController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SphereController = _classThis;
})();
exports.SphereController = SphereController;
//# sourceMappingURL=SphereController.js.map