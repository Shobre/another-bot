const commando = require("discord.js-commando");
const axios = require("axios");

class TranslateCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "translate",
      group: "language",
      memberName: "translate",
      description: `Use !translate <Your words>`
    });
  }
  async run(message, args) {
axios
    .get("https://translate.yandex.net/api/v1.5/tr.json/translate", {
      params: {
        key: process.env.YANDEX_API_KEY,
        text: args,
        lang: "en"
      }
    })
    .then(res => {
      if (res.data.text[0] !== message.content) {
        console.log(res.data.text[0]);
        console.log(res.data.lang);
        message.reply(res.data.text[0]);
      } else {
        console.log(res.data.lang);
        message.reply("I can't translate that... try something else.");
      }
    });

}
}

module.exports = TranslateCommand;
