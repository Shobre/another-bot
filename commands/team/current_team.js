const commando = require("discord.js-commando");
const discord = require("discord.js");

class CurrentTeamCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "current-team",
      group: "team",
      memberName: "current-team",
      description: `Shows the current team`
    });
  }

  async run(message, args) {
    var teamInfo = new discord.RichEmbed().setTitle("Current Team members");

    for (var i = 0; i < currentTeamMembers.length; i++) {
      teamInfo.addField("Member " + (i + 1), currentTeamMembers[i].username, false);
    }

    message.channel.send(teamInfo);
  }
}

module.exports = CurrentTeamCommand;
