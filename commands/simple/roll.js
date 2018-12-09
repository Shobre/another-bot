const commando = require("discord.js-commando");

class RollCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "roll",
      group: "simple",
      memberName: "roll",
      description:
        `!roll gives you a random number between 1-100. 
        !roll <value> gives you a random number between one and your "value"`
    });
  }

  async run(message, args) {
    console.log(args);
    if (isNaN(args) || args === "") {
      var diceRoll = Math.floor(Math.random() * 100) + 1;
      message.reply("Rolled between 1-100 and got " + diceRoll);
    } else {
      var diceRoll = Math.floor(Math.random() * args) + 1;
      message.reply(
        "Your " + args + "-sided dice landed on " + diceRoll
      );
    }
  }
}

module.exports = RollCommand;
