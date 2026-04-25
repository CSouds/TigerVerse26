import { OpenAI } from 'RemoteServiceGateway.lspkg/HostedExternal/OpenAI';

@component
export class OpenAIExample extends BaseScriptComponent {
  @input
  textOutput: Text;

  onAwake() {
    this.createEvent('OnStartEvent').bind(() => {
      this.doChatCompletions();
    });
  }
  doChatCompletions() {
    OpenAI.chatCompletions({
      model: 'gpt-4.1-nano',
      messages: [
        {
          role: 'system',
          content:
            "You are a PHD math professor who can help me solve math problems in a way a short response.",
        },
        {
          role: 'user',
          content: 'What is the square root of 144?',
        },
      ],
      temperature: 0.7, // lower is more deterministic, higher is more creative
    })
    .then((response) => {
      const answer =
        response?.choices?.[0]?.message?.content ?? "[no response]";
      print("[RSG_TEST] " + answer);
      if (this.textOutput) {
        this.textOutput.text = answer;
      }
    })
    .catch((error) => {
      const msg = "Error: " + error;
      print("[RSG_TEST] " + msg);
      if (this.textOutput) {
        this.textOutput.text = msg;
      }
    });
}
}
