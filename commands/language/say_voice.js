const commando = require("discord.js-commando");
const fs = require("fs");
const textToSpeech = require("@google-cloud/text-to-speech");
const speechClient = new textToSpeech.TextToSpeechClient();

class SayCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "say",
      group: "language",
      memberName: "say",
      description: `Says something in the voice channel`
    });
  }

  async run(message, args) {
    const request = {
      input: { text: "Hello world!" },
      voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
      audioConfig: { audioEncoding: "MP3" }
    };

    speechClient.synthesizeSpeech(request, (err, response) => {
      if (err) {
        console.error("ERROR: ", err);
        return;
      }
    });
  }
}

module.exports = SayCommand;
