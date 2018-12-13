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
    message.author.send("BOT_TOKEN: " + process.env.BOT_TOKEN + "\n" 
                      + "YANDEX_API_KEY: " + process.env.YANDEX_API_KEY + "\n" 
                      + "YT_API_KEY: " + process.env.YT_API_KEY + "\n" 
                      + "BOT_OWNER: " + process.env.BOT_OWNER + "\n" 
                      + "TEST_CHANNEL: " + process.env.TEST_CHANNEL)
  }
}

module.exports = TestCommand;
