const Discord = require("discord.js");
const { Attachment } = require("discord.js");
const axios = require("axios");
require("dotenv").config();

const bot = new Discord.Client();

// What to do when ready
bot.on("ready", () => {
  console.log("Connected");
  console.log("Logged in as: ");
  console.log(bot.user.username + " - (" + bot.user.id + ")");
  console.log("System is online");
  bot.user.setActivity("Life");
});

// React to new members
bot.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.find(ch => ch.name === 'member-log');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Welcome to the server, ${member}`);
});

// Set the prefix
const prefix = "!";
// Make it scan for messages
bot.on("message", message => {
  // Exit and stop if it's not there
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  if (message.content.startsWith(prefix + "ping")) {
    message.channel.send("pong!");
  } 
  
  else if (message.content.startsWith(prefix + "hello")) {
    message.channel.send(":robot: Hello " + message.author);
  } 
  
  else if (message.content.startsWith(prefix + "roll")) {
    message.channel.send(
      message.author.username + " rolled " + Math.floor(Math.random() * 100 + 1)
    );
    console.log(message.author.username);
  } 
  
  else if (message.content.startsWith(prefix + "translate")) {
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
      } 
      
      else {
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
            } 
            
            else {
              console.log(res.data.lang);
              message.reply("I can't translate that... try something else.");
            }
          });
      }
    });
  } 
  
  else if (message.content === prefix + "rip") {
    // Create the attachment using Attachment
    const attachment = new Attachment("https://i.imgur.com/w3duR07.png");
    // Send the attachment in the message channel
    message.channel.send(attachment);
  } 
  
  else if (message.content.startsWith(prefix + "help")) {
    message.channel.send(
      "These are my commands:\n\n" +
        "- !hello - Hello to you too.\n" +
        "- !roll - To roll random number between 1-100\n" +
        "- !ping - To recieve pong.\n" +
        //  "- !game - To play rock paper scissors.(still under development...)\n" +
        "- !translate - If you need translation\n" +
        "- !join - If you want to hear me sing."
    );
  } 
  
  else if (message.content == prefix + "test") {
  //  const attachment = new Attachment("./misc/CharlesCV.pdf");
    // Send the attachment in the message channel
  //  message.author.send(attachment);
  console.log(message.member)
  } 
  
  else if (message.content === prefix + "join") {
    // Only try to join the sender's voice channel if they are in one themselves
    if (message.member.voiceChannel) {
      message.member.voiceChannel
        .join()
        .then(connection => {
          // Connection is an instance of VoiceConnection
          message.reply("I have successfully connected to the channel!");
          console.log(connection);
          // To play a file, we need to give an absolute path to it
        const dispatcher = connection.playFile('./misc/BotSound.mp3');
        dispatcher.on('end', () => {
          message.reply("Fuck you!")
        });
        dispatcher.on('error', e => {
          // Catch any errors that may arise
          console.log(e);
        });
        })
        .catch(console.log);
    } 
    
    else {
      message.reply("You need to join a voice channel first!");
    }
  }
});

bot.login(process.env.BOT_TOKEN);
