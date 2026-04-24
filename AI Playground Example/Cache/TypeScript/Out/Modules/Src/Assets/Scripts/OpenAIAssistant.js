"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIAssistant = void 0;
var __selfType = requireType("./OpenAIAssistant");
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
 * Open AIAssistant component for the AI Playground Spectacles lens.
 */
const OpenAI_1 = require("RemoteServiceGateway.lspkg/HostedExternal/OpenAI");
const AudioProcessor_1 = require("RemoteServiceGateway.lspkg/Helpers/AudioProcessor");
const Event_1 = require("SpectaclesInteractionKit.lspkg/Utils/Event");
const Logger_1 = require("Utilities.lspkg/Scripts/Utils/Logger");
let OpenAIAssistant = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var OpenAIAssistant = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.websocketRequirementsObj = this.websocketRequirementsObj;
            this.dynamicAudioOutput = this.dynamicAudioOutput;
            this.microphoneRecorder = this.microphoneRecorder;
            this.instructions = this.instructions;
            this.haveAudioOutput = this.haveAudioOutput;
            this.voice = this.voice;
            this.enableLogging = this.enableLogging;
            this.enableLoggingLifecycle = this.enableLoggingLifecycle;
            this.audioProcessor = new AudioProcessor_1.AudioProcessor();
            this.updateTextEvent = new Event_1.default();
            this.functionCallEvent = new Event_1.default();
        }
        __initialize() {
            super.__initialize();
            this.websocketRequirementsObj = this.websocketRequirementsObj;
            this.dynamicAudioOutput = this.dynamicAudioOutput;
            this.microphoneRecorder = this.microphoneRecorder;
            this.instructions = this.instructions;
            this.haveAudioOutput = this.haveAudioOutput;
            this.voice = this.voice;
            this.enableLogging = this.enableLogging;
            this.enableLoggingLifecycle = this.enableLoggingLifecycle;
            this.audioProcessor = new AudioProcessor_1.AudioProcessor();
            this.updateTextEvent = new Event_1.default();
            this.functionCallEvent = new Event_1.default();
        }
        onAwake() {
            this.logger = new Logger_1.Logger("OpenAIAssistant", this.enableLogging || this.enableLoggingLifecycle, true);
            if (this.enableLoggingLifecycle)
                this.logger.debug("LIFECYCLE: onAwake()");
        }
        createOpenAIRealtimeSession() {
            this.websocketRequirementsObj.enabled = true;
            let internetStatus = global.deviceInfoSystem.isInternetAvailable() ? "Websocket connected" : "No internet";
            this.updateTextEvent.invoke({ text: internetStatus, completed: true });
            global.deviceInfoSystem.onInternetStatusChanged.add((args) => {
                internetStatus = args.isInternetAvailable ? "Reconnected to internet" : "No internet";
                this.updateTextEvent.invoke({ text: internetStatus, completed: true });
            });
            this.dynamicAudioOutput.initialize(24000);
            this.microphoneRecorder.setSampleRate(24000);
            this.OAIRealtime = OpenAI_1.OpenAI.createRealtimeSession({
                model: "gpt-4o-mini-realtime-preview"
            });
            this.OAIRealtime.onOpen.add((event) => {
                this.logger.info("Connection opened");
                this.sessionSetup();
            });
            let completedTextDisplay = true;
            this.OAIRealtime.onMessage.add((message) => {
                if (message.type === "response.text.delta" || message.type === "response.audio_transcript.delta") {
                    if (!completedTextDisplay) {
                        this.updateTextEvent.invoke({
                            text: message.delta,
                            completed: false
                        });
                    }
                    else {
                        this.updateTextEvent.invoke({
                            text: message.delta,
                            completed: true
                        });
                    }
                    completedTextDisplay = false;
                }
                else if (message.type === "response.done") {
                    completedTextDisplay = true;
                }
                else if (message.type === "response.audio.delta") {
                    const delta = Base64.decode(message.delta);
                    this.dynamicAudioOutput.addAudioFrame(delta);
                }
                else if (message.type === "response.output_item.done") {
                    if (message.item && message.item.type === "function_call") {
                        const functionCall = message.item;
                        this.logger.info(`Function called: ${functionCall.name}`);
                        this.logger.debug(`Function args: ${functionCall.arguments}`);
                        const args = JSON.parse(functionCall.arguments);
                        this.functionCallEvent.invoke({
                            name: functionCall.name,
                            args: args,
                            callId: functionCall.call_id
                        });
                    }
                }
                else if (message.type === "input_audio_buffer.speech_started") {
                    this.logger.info("Speech started, interrupting the AI");
                    this.dynamicAudioOutput.interruptAudioOutput();
                }
            });
            this.OAIRealtime.onError.add((event) => {
                this.logger.error("" + event);
            });
            this.OAIRealtime.onClose.add((event) => {
                this.logger.info("Connection closed: " + event.reason);
                this.updateTextEvent.invoke({
                    text: "Websocket closed: " + event.reason,
                    completed: true
                });
            });
        }
        streamData(stream) {
            if (stream) {
                this.microphoneRecorder.startRecording();
            }
            else {
                this.microphoneRecorder.stopRecording();
            }
        }
        interruptAudioOutput() {
            if (this.dynamicAudioOutput && this.haveAudioOutput) {
                this.dynamicAudioOutput.interruptAudioOutput();
            }
            else {
                this.logger.warn("DynamicAudioOutput is not initialized");
            }
        }
        sessionSetup() {
            const modalitiesArray = ["text"];
            if (this.haveAudioOutput) {
                modalitiesArray.push("audio");
            }
            const tools = [
                {
                    type: "function",
                    name: "Snap3D",
                    description: "Generates a 3D model based on a text prompt",
                    parameters: {
                        type: "object",
                        properties: {
                            prompt: {
                                type: "string",
                                description: "The text prompt to generate a 3D model from. Cartoonish styles work best. Use 'full body' when generating characters."
                            }
                        },
                        required: ["prompt"]
                    }
                }
            ];
            const sessionUpdateMsg = {
                type: "session.update",
                session: {
                    instructions: this.instructions,
                    voice: this.voice,
                    modalities: modalitiesArray,
                    input_audio_format: "pcm16",
                    tools: tools,
                    output_audio_format: "pcm16",
                    turn_detection: {
                        type: "server_vad",
                        threshold: 0.5,
                        prefix_padding_ms: 300,
                        silence_duration_ms: 500,
                        create_response: true
                    }
                }
            };
            this.OAIRealtime.send(sessionUpdateMsg);
            this.audioProcessor.onAudioChunkReady.add((encodedAudioChunk) => {
                const audioMsg = {
                    type: "input_audio_buffer.append",
                    audio: encodedAudioChunk
                };
                this.OAIRealtime.send(audioMsg);
            });
            this.microphoneRecorder.onAudioFrame.add((audioFrame) => {
                this.audioProcessor.processFrame(audioFrame);
            });
        }
        sendFunctionCallUpdate(functionName, callId, response) {
            this.logger.debug("Call id = " + callId);
            const messageToSend = {
                type: "conversation.item.create",
                item: {
                    type: "function_call_output",
                    call_id: callId,
                    output: response
                }
            };
            this.OAIRealtime.send(messageToSend);
        }
    };
    __setFunctionName(_classThis, "OpenAIAssistant");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OpenAIAssistant = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OpenAIAssistant = _classThis;
})();
exports.OpenAIAssistant = OpenAIAssistant;
//# sourceMappingURL=OpenAIAssistant.js.map