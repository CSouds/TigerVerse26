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
exports.AIAssistantUIBridge = void 0;
var __selfType = requireType("./AIAssistantUIBridge");
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
const animate_1 = require("SpectaclesInteractionKit.lspkg/Utils/animate");
const decorators_1 = require("SnapDecorators.lspkg/decorators");
const Logger_1 = require("Utilities.lspkg/Scripts/Utils/Logger");
const MathUtils_1 = require("Utilities.lspkg/Scripts/Utils/MathUtils");
var AssistantType;
(function (AssistantType) {
    AssistantType["Gemini"] = "Gemini";
    AssistantType["OpenAI"] = "OpenAI";
})(AssistantType || (AssistantType = {}));
let AIAssistantUIBridge = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    let _instanceExtraInitializers = [];
    let _onStart_decorators;
    var AIAssistantUIBridge = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.geminiAssistant = (__runInitializers(this, _instanceExtraInitializers), this.geminiAssistant);
            this.openAIAssistant = this.openAIAssistant;
            this.sphereController = this.sphereController;
            this.snap3DInteractableFactory = this.snap3DInteractableFactory;
            this.hintTitle = this.hintTitle;
            this.hintText = this.hintText;
            this.geminiButton = this.geminiButton;
            this.openAIButton = this.openAIButton;
            this.enableLogging = this.enableLogging;
            this.enableLoggingLifecycle = this.enableLoggingLifecycle;
            this.assistantType = AssistantType.Gemini;
            this.textIsVisible = true;
        }
        __initialize() {
            super.__initialize();
            this.geminiAssistant = (__runInitializers(this, _instanceExtraInitializers), this.geminiAssistant);
            this.openAIAssistant = this.openAIAssistant;
            this.sphereController = this.sphereController;
            this.snap3DInteractableFactory = this.snap3DInteractableFactory;
            this.hintTitle = this.hintTitle;
            this.hintText = this.hintText;
            this.geminiButton = this.geminiButton;
            this.openAIButton = this.openAIButton;
            this.enableLogging = this.enableLogging;
            this.enableLoggingLifecycle = this.enableLoggingLifecycle;
            this.assistantType = AssistantType.Gemini;
            this.textIsVisible = true;
        }
        onAwake() {
            this.logger = new Logger_1.Logger("AIAssistantUIBridge", this.enableLogging || this.enableLoggingLifecycle, true);
            if (this.enableLoggingLifecycle)
                this.logger.debug("LIFECYCLE: onAwake()");
        }
        onStart() {
            if (this.enableLoggingLifecycle)
                this.logger.debug("LIFECYCLE: onStart()");
            this.geminiButton.onInitialized.add(() => {
                this.geminiButton.onTriggerUp.add(() => {
                    this.assistantType = AssistantType.Gemini;
                    this.hintTitle.text = "Gemini Live Example";
                    this.startWebsocketAndUI();
                });
            });
            this.openAIButton.onInitialized.add(() => {
                this.openAIButton.onTriggerUp.add(() => {
                    this.assistantType = AssistantType.OpenAI;
                    this.hintTitle.text = "OpenAI Realtime Example";
                    this.startWebsocketAndUI();
                });
            });
        }
        hideButtons() {
            this.geminiButton.enabled = false;
            this.openAIButton.enabled = false;
            {
                const tr = this.geminiButton.sceneObject.getTransform();
                const start = tr.getLocalScale();
                const end = vec3.zero();
                const duration = 0.5;
                (0, animate_1.default)({
                    duration,
                    easing: "ease-out-quad",
                    update: (t) => {
                        tr.setLocalScale(new vec3(MathUtils_1.MathUtils.lerp(start.x, end.x, t), MathUtils_1.MathUtils.lerp(start.y, end.y, t), MathUtils_1.MathUtils.lerp(start.z, end.z, t)));
                    },
                    ended: () => {
                        this.geminiButton.sceneObject.enabled = false;
                    }
                });
            }
            {
                const tr = this.openAIButton.sceneObject.getTransform();
                const start = tr.getLocalScale();
                const end = vec3.zero();
                const duration = 0.5;
                (0, animate_1.default)({
                    duration,
                    easing: "ease-out-quad",
                    update: (t) => {
                        tr.setLocalScale(new vec3(MathUtils_1.MathUtils.lerp(start.x, end.x, t), MathUtils_1.MathUtils.lerp(start.y, end.y, t), MathUtils_1.MathUtils.lerp(start.z, end.z, t)));
                    },
                    ended: () => {
                        this.openAIButton.sceneObject.enabled = false;
                    }
                });
            }
        }
        startWebsocketAndUI() {
            this.hideButtons();
            this.hintText.text = "Pinch on the orb next to your left hand to activate";
            if (global.deviceInfoSystem.isEditor()) {
                this.hintText.text = "Look down and click on the orb to activate";
            }
            this.sphereController.initializeUI();
            this.currentAssistant = this.assistantType === AssistantType.Gemini ? this.geminiAssistant : this.openAIAssistant;
            if (this.assistantType === AssistantType.Gemini) {
                this.geminiAssistant.createGeminiLiveSession();
            }
            else if (this.assistantType === AssistantType.OpenAI) {
                this.openAIAssistant.createOpenAIRealtimeSession();
            }
            this.connectAssistantEvents();
            this.sphereController.isActivatedEvent.add((isActivated) => {
                this.currentAssistant.streamData(isActivated);
                if (!isActivated) {
                    this.currentAssistant.interruptAudioOutput();
                }
            });
        }
        connectAssistantEvents() {
            this.currentAssistant.updateTextEvent.add((data) => {
                this.sphereController.setText(data);
            });
            this.currentAssistant.functionCallEvent.add((data) => {
                if (data.name === "Snap3D") {
                    if (this.assistantType === AssistantType.Gemini) {
                        this.geminiAssistant.sendFunctionCallUpdate(data.name, "Beginning to create 3D object...");
                    }
                    else {
                        this.openAIAssistant.sendFunctionCallUpdate(data.name, data.callId, "Beginning to create 3D object...");
                    }
                    this.snap3DInteractableFactory
                        .createInteractable3DObject(data.args.prompt)
                        .then((status) => {
                        if (this.assistantType === AssistantType.Gemini) {
                            this.geminiAssistant.sendFunctionCallUpdate(data.name, status);
                        }
                        else {
                            this.openAIAssistant.sendFunctionCallUpdate(data.name, data.callId, status);
                        }
                    })
                        .catch((error) => {
                        if (this.assistantType === AssistantType.Gemini) {
                            this.geminiAssistant.sendFunctionCallUpdate(data.name, error);
                        }
                        else {
                            this.openAIAssistant.sendFunctionCallUpdate(data.name, data.callId, error);
                        }
                    });
                }
            });
        }
    };
    __setFunctionName(_classThis, "AIAssistantUIBridge");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _onStart_decorators = [decorators_1.bindStartEvent];
        __esDecorate(_classThis, null, _onStart_decorators, { kind: "method", name: "onStart", static: false, private: false, access: { has: obj => "onStart" in obj, get: obj => obj.onStart }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AIAssistantUIBridge = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AIAssistantUIBridge = _classThis;
})();
exports.AIAssistantUIBridge = AIAssistantUIBridge;
//# sourceMappingURL=AIAssistantUIBridge.js.map