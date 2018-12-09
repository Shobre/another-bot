const commando = require("discord.js-commando");

class NewTeamCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "new-team",
      group: "team",
      memberName: "new-team",
      description: `Creates a new team`
    });
  }

  async run(message, args) {
    currentTeamMembers = []
    message.reply("The current team has been reset")
  }
}

module.exports = NewTeamCommand;
