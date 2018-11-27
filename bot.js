var Discord = require("discord.js");
var axios = require("axios");
require("dotenv").config();

const bot = new Discord.Client();

bot.on("ready", () => {
  console.log("Connected");
  console.log("Logged in as: ");
  console.log(bot.user.username + " - (" + bot.user.id + ")");
  console.log("System is online");
  bot.user.setActivity("Life");
});

// Set the prefix
const prefix = "!";
bot.on("message", message => {
  // Exit and stop if it's not there
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  if (message.content.startsWith(prefix + "ping")) {
    message.channel.send("pong!");
  } else if (message.content.startsWith(prefix + "hello")) {
    message.channel.send(":robot: Hello " + message.author);
  } else if (message.content.startsWith(prefix + "roll")) {
    message.channel.send(
      message.author.username + " rolled " + Math.floor(Math.random() * 100 + 1)
    );
    console.log(message.author.username);
  } else if (message.content.startsWith(prefix + "translate")) {
    message.channel.send("What do you want to translate?");
    const collector = new Discord.MessageCollector(
      message.channel,
      m => m.author.id === message.author.id
    );
    console.log(collector);
    collector.on("collect", message => {
      if (message.content.startsWith(prefix + "exit")) {
        message.reply("Exiting translate mode.");
        collector.stop();
      } else {
        axios
          .get("https://translate.yandex.net/api/v1.5/tr.json/translate", {
            params: {
              key: process.env.YANDEX_API_KEY,
              text: message.content,
              lang: "en"
            }
          })
          .then(res => {
            if (res.data.text[0] !== message.content) {
              console.log(res.data.text[0]);
              console.log(res.data.lang);
              message.reply(res.data.text[0]);
              collector.stop();
            } else {
              console.log(res.data.lang);
              message.reply("I can't translate that... try something else.");
            }
          });
      }
    });
  } else if (message.content.startsWith(prefix + "help")) {
    message.channel.send(
      "These are my commands:\n\n" +
        "- !hello - Hello to you too.\n" +
        "- !roll - To roll random number between 1-100\n" +
        "- !ping - To recieve pong.\n" +
        //  "- !game - To play rock paper scissors.(still under development...)\n" +
        "- !translate - If you need translation"
    );
  }
});

bot.login(process.env.BOT_TOKEN);
