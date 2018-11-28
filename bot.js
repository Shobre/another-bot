const Discord = require("discord.js");
const { Attachment } = require("discord.js");
const axios = require("axios");
const fs = require("fs");
const ytdl = require("ytdl-core");
require("dotenv").config();

const bot = new Discord.Client();
var ytAudioQueue = [];

// What to do when ready
bot.on("ready", () => {
  console.log("Connected");
  console.log("Logged in as: ");
  console.log(bot.user.username + " - (" + bot.user.id + ")");
  console.log("System is online");
  bot.user.setActivity("Life");
});

// Make it scan for messages
bot.on("message", message => {
  // Exit and stop if it's not there
  if (!message.content.startsWith("!") || message.author.bot) return;
  // It will listen for messages that will start with `!`
  var messageParts = message.content.substring(1).split(" ");
  var cmd = messageParts[0].toLowerCase();
  var parameters = messageParts.splice(1, messageParts.length);

  console.log("cmd: " + cmd);
  console.log("parameters: " + parameters);
  console.log(parameters.join(" "));

  switch (cmd) {
    case "ping":
      message.reply("pong!");
      break;
    case "hi":
      message.reply(" Hi there buddy! :robot:");
      break;
    case "roll":
      message.reply(" rolled " + Math.floor(Math.random() * 100 + 1));
      console.log(message.author.username);
      break;
    case "translate":
      TranslateCommand(message, parameters.join(" "));
      break;
    case "help":
      HelpCommand(message);
      break;
    case "hireme":
      sendCV(message);
      break;
    case "sing":
      SingCommand(message);
      break;
    case "play":
      PlayCommand(parameters.join(" "), message);
      break;
    case "test":
      testCommand(message);
      break;
    default:
      break;
  }
});

// React to new members
bot.on("guildMemberAdd", member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.find(ch => ch.name === "member-log");
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(
    `Welcome to the server, ${member}!\nTo know what I can do you can typ !help.`
  );
});



/* COMMAND HANDLERS */

TranslateCommand = (message, searchPhrase) => {
  console.log(searchPhrase);
  axios
    .get("https://translate.yandex.net/api/v1.5/tr.json/translate", {
      params: {
        key: process.env.YANDEX_API_KEY,
        text: searchPhrase,
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
};

sendCV = message => {
  // Create the attachment using Attachment
  const attachment = new Attachment("https://i.imgur.com/w3duR07.png");
  const cv = new Attachment("./misc/CharlesCV.pdf");
  // Send the attachment in the message channel
  message.channel.send(attachment);
  // Send the attachment in the message channel
  message.author.send(cv);
};

HelpCommand = message => {
  message.reply(
    " These are my commands:\n\n" +
      "- !hi - If you'd like to greet me\n" +
      "- !roll - Roll a random number between 1-100.\n" +
      "- !ping - To recieve pong.\n" +
      //  "- !game - To play rock paper scissors.(still under development...)\n" +
      "- !translate - Translate by typing !translate <Your Words>\n" +
      "- !hireme - If you're curious about my creator.\n" +
      "- !play - Type !play <search term> to play music from Youtube\n" +
      "- !sing - Hear me sing."
  );
};

SingCommand = message => {
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
};

PlayCommand = (searchTerm, message) => {
  if (searchTerm == null || searchTerm == "") {
    message.reply("You need to add something after !play for me to search.");
    return;
  }
  // Only try to join the sender's voice channel if they are in one themselves
  if (message.member.voiceChannel) {
    YoutubeSearch(searchTerm);
    message.member.voiceChannel
      .join()
      .then(connection => {
        console.log(ytAudioQueue)
        if (ytAudioQueue.length > 1) {
          ytAudioQueue.pop();
          console.log(ytAudioQueue)
        PlayStream(ytAudioQueue[0]);
        message.channel.send("Now playing...\n" + ytAudioQueue[0])
        }
      })
      .catch(console.log);
  } else {
    message.reply("You need to join a voice channel first!");
  }
};

testCommand = message => {
  console.log(message.author + " " + message.author.username);
};

/* END COMMAND HANDLERS */


/* METHODS */

YoutubeSearch = searchKeywords => {
  axios
    .get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${escape(
        searchKeywords
      )}&`,
      { params: { key: process.env.YT_API_KEY } }
    )
    .then(response => {
      var body = response.data.items;
      if (body.length == 0) {
        console.log("Your search gave 0 results");
        return videoId;
      }
      console.log(body[0].id.videoId)
      for (var item of body) {
        if (item.id.kind === "youtube#video") {
          QueueYtAudioStream(item.id.videoId);
        }
      }
      // console.log(response.data.items)
    })
    .catch(error => {
      console.log(err); //Axios entire error message
      console.log(err.response.data.error); //Google API error message
      console.log("Unexpected error when searching YouTube");
      return null;
    });
  return null;
};

QueueYtAudioStream = videoId => {
  var streamUrl = `https://www.youtube.com/watch?v=${videoId}`;
  ytAudioQueue.push(streamUrl);
};

PlayStream = streamUrl => {
  const streamOptions = { seek: 0, volume: 1 };
  console.log("Streaming audio from " + streamUrl);

  if (streamUrl) {
    const stream = ytdl(streamUrl, { filter: "audioonly" });
    const dispatcher = bot.voiceConnections
      .first()
      .playStream(stream, streamOptions);
  }
};

/* END METHODS */

bot.login(process.env.BOT_TOKEN);
