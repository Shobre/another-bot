const commando = require("discord.js-commando");

class MirrorCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "mirror",
      group: "simple",
      memberName: "mirror",
      description: `Look at yourself`
    });
  }

  async run(message) {
    message.reply(message.author.avatarURL);
  }
}

module.exports = MirrorCommand;
