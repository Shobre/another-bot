const commando = require("discord.js-commando");
const Pornsearch = require("pornsearch");

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
    const Searcher = new Pornsearch.search(args).driver("pornhub");
    Searcher.videos()
      .then(videos => {
        message.reply(videos[0].url);
        console.log(videos[0]);
      })
      .then(() =>
        Searcher.gifs().then(gifs => {
          message.reply(gifs[0].webm);
          console.log(gifs[0]);
        })
      );
  }
}

module.exports = TestCommand;
