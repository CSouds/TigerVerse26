"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageGenerator = void 0;
/**
 * Specs Inc. 2026
 * Image Generator component for the AI Playground Spectacles lens.
 */
const Gemini_1 = require("RemoteServiceGateway.lspkg/HostedExternal/Gemini");
const OpenAI_1 = require("RemoteServiceGateway.lspkg/HostedExternal/OpenAI");
const Promisfy_1 = require("RemoteServiceGateway.lspkg/Utils/Promisfy");
class ImageGenerator {
    constructor(model, logger) {
        this.rmm = require("LensStudio:RemoteMediaModule");
        this.model = model;
        this.logger = logger;
    }
    generateImage(prompt) {
        if (this.model === "OpenAI") {
            return this.generateWithOpenAI(prompt);
        }
        else {
            return this.generateWithGemini(prompt);
        }
    }
    generateWithGemini(prompt) {
        return new Promise((resolve, reject) => {
            const request = {
                model: "gemini-2.0-flash-preview-image-generation",
                type: "generateContent",
                body: {
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                }
                            ],
                            role: "user"
                        }
                    ],
                    generationConfig: {
                        responseModalities: ["TEXT", "IMAGE"]
                    }
                }
            };
            Gemini_1.Gemini.models(request)
                .then((response) => {
                if (!response.candidates || response.candidates.length === 0) {
                    reject("No image generated in response");
                    return;
                }
                let foundImage = false;
                for (const part of response.candidates[0].content.parts) {
                    if (part?.inlineData) {
                        foundImage = true;
                        const b64Data = part.inlineData.data;
                        Base64.decodeTextureAsync(b64Data, (texture) => {
                            resolve(texture);
                        }, () => {
                            reject("Failed to decode texture from base64 data.");
                        });
                        break;
                    }
                }
                if (!foundImage) {
                    reject("No image data found in response");
                }
            })
                .catch((error) => {
                reject("Error while generating image: " + error);
            });
        });
    }
    generateWithOpenAI(prompt) {
        return new Promise((resolve, reject) => {
            const req = {
                prompt: prompt,
                n: 1,
                model: "dall-e-3"
            };
            OpenAI_1.OpenAI.imagesGenerate(req)
                .then((result) => {
                result.data.forEach((datum) => {
                    const b64 = datum.b64_json;
                    const url = datum.url;
                    if (url) {
                        if (this.logger)
                            this.logger.info("Texture loaded as image URL");
                        const internetModule = require("LensStudio:InternetModule");
                        const request = RemoteServiceHttpRequest.create();
                        request.url = url;
                        Promisfy_1.Promisfy.InternetModule.performHttpRequest(internetModule, request).then((response) => {
                            const resource = response.asResource();
                            this.rmm.loadResourceAsImageTexture(resource, (texture) => {
                                resolve(texture);
                            }, () => {
                                reject("Failure to download texture from URL");
                            });
                        });
                    }
                    else if (b64) {
                        if (this.logger)
                            this.logger.debug("Decoding texture from base64");
                        Base64.decodeTextureAsync(b64, (texture) => {
                            resolve(texture);
                        }, () => {
                            reject("Failure to download texture from base64");
                        });
                    }
                });
            })
                .catch((error) => reject(error));
        });
    }
}
exports.ImageGenerator = ImageGenerator;
//# sourceMappingURL=ImageGenerator.js.map