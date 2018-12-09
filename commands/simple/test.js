const commando = require("discord.js-commando");

class TestCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "test",
      group: "simple",
      memberName: "test",
      description: `For trying out new stuff`
    });
  }

  async run(message, args) {
    console.log(message)
  }
}

module.exports = TestCommand;
