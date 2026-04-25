import { OpenAI } from 'RemoteServiceGateway.lspkg/HostedExternal/OpenAI';

@component
export class ShowFeedback extends BaseScriptComponent {

    @input
    interactable!: any;

    @input
    textComponent!: Text;

    @input
    textBubbleContainer!: SceneObject;

    onAwake() {
        // Hide the bubble when the lens starts
        if (this.textBubbleContainer) {
            this.textBubbleContainer.enabled = false;
        }

        // Make sure interactable exists, then bind the trigger
        if (this.interactable && this.interactable.onTriggerStart) {
            this.interactable.onTriggerStart.add(() => {
                this.displayFeedback();
            });
        } else {
            print("ShowFeedback: Interactable not linked or missing onTriggerStart.");
        }
    }

    // Notice the 'async' keyword here! This allows us to wait for the API.
    async displayFeedback() {
        
        // 1. Immediately show the bubble with a loading state
        if (this.textBubbleContainer) {
            this.textBubbleContainer.enabled = true;
        }
        if (this.textComponent) {
            this.textComponent.text = "Thinking..."; 
        }

        // 2. Call the AI inside a try/catch block
        try {
            const response = await OpenAI.chatCompletions({
                model: 'gpt-4.1-nano',
                messages: [
                    {
                        role: 'system',
                        content: "You are a math assistant. Keep your response to one short sentence."
                    },
                    {
                        role: 'user',
                        content: 'What is the square root of 144?' // (You will swap this with the actual math problem later)
                    }
                ],
                temperature: 0.7,
            });

            // 3. Extract the answer safely
            const answer = response?.choices?.[0]?.message?.content ?? "Sorry, I couldn't process that.";
            print("[RSG_TEST] AI Responded: " + answer);

            // 4. Update the text bubble with the real answer
            if (this.textComponent) {
                this.textComponent.text = answer;
            }

        } catch (error) {
            // If the Wi-Fi drops or the API fails, handle it gracefully
            print("[RSG_TEST] Error: " + error);
            if (this.textComponent) {
                this.textComponent.text = "Error connecting to AI.";
            }
        }
    }
}