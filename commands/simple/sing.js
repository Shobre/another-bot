const commando = require("discord.js-commando");

class SingCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "sing",
      group: "simple",
      memberName: "sing",
      description: `Hear me sing.`
    });
  }

  async run(message) {
     // Only try to join the sender's voice channel if they are in one themselves
  if (message.member.voiceChannel) {
    message.member.voiceChannel
      .join()
      .then(connection => {
        // Connection is an instance of VoiceConnection
        console.log(connection);
        // To play a file, we need to give an absolute path to it
        const dispatcher = connection.playFile("./misc/BotSound.mp3");
        dispatcher.on("end", () => {
          message.reply("Wasn't that beautiful? :robot:");
          // Leave the channel
          message.member.voiceChannel.leave();
        });
        dispatcher.on("error", e => {
          // Catch any errors that may arise
          console.log(e);
        });
      })
      .catch(console.log);
  } else {
    message.reply("You need to join a voice channel first!");
  }
  }
}

module.exports = SingCommand;
