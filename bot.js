const Commando = require("discord.js-commando");
const axios = require("axios");
const ytdl = require("ytdl-core");
const path = require("path");
require("dotenv").config();

const bot = new Commando.Client({
  commandPrefix: "!",
  owner: process.env.BOT_OWNER,
  disableEveryone: false,
  unknownCommandResponse: true
});

bot.registry
  .registerDefaultTypes()
  .registerGroups([
    ["simple", "Simple"],
    ["translate", "Translate"],
    ["music", "Music"],
    ["team", "Team"],
    ["wow", "WoW"]
  ])
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerCommandsIn(path.join(__dirname, "commands"));

global.servers = [];
global.currentTeamMembers = [];
global.pvpLadder = [];

// What to do when ready
bot.on("ready", () => {
  console.log("Connected");
  console.log("Logged in as: ");
  console.log(bot.user.username + " - (" + bot.user.id + ")");
  console.log("System is online");
  bot.user.setActivity("Test");
});

bot.on("guildMemberAdd", member => {
  member.send("Welcome to the Server");
  const memberRole = member.guild.roles.find("name", "Test subject");
  member.addRole(memberRole);

  /* Create a custom role */
  // member.guild.createRole({
  //   name: member.user.username,
  //   color: "0x00FF00",
  //   permissions: []
  // }).then( role => {
  //   member.addRole(role)
  // })

  /* Add random role */
  // const generalChannel = member.guild.channels.find("name", "general");
  // const team1 = member.guild.roles.find("name", "Team 1");
  // const team2 = member.guild.roles.find("name", "Team 2");
  // const team3 = member.guild.roles.find("name", "Team 3");
  // var chance = Math.floor(Math.random() * 3)
  // if(chance == 0){
  //   member.addRole(team1)
  //   member.send("Welcome to Team 1!")
  //   generalChannel.send(member + " joined Team 1")
  // }
  // else if(chance == 1) {
  //   member.addRole(team2)
  //   member.send("Welcome to Team 2!")
  //   generalChannel.send(member + " joined Team 1")
  // }
  // else {
  //   member.addRole(team3)
  //   member.send("Welcome to Team 3!")
  //   generalChannel.send(member + " joined Team 1")
  // }
});

// Make it scan for messages
bot.on("message", message => {
  if (message.content == "join") {
    message.member.send("Welcome to the Server");
    const memberRole = message.member.guild.roles.find("name", "@Test subject");
    message.member.addRole(memberRole);
  }
});

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
        console.log(ytAudioQueue);
        if (ytAudioQueue.length > 1) {
          ytAudioQueue.pop();
          console.log(ytAudioQueue);
          PlayStream(ytAudioQueue[0]);
          message.channel.send("Now playing...\n" + ytAudioQueue[0]);
        }
      })
      .catch(console.log);
  } else {
    message.reply("You need to join a voice channel first!");
  }
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
      console.log(body[0].id.videoId);
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
    var dispatcher = bot.voiceConnections
      .first()
      .playStream(stream, streamOptions);
    dispatcher.on("end", () => {
      dispatcher = null;
      PlayNextStreamInQueue();
    });
  }
};

/* END METHODS */

bot.login(process.env.BOT_TOKEN);
