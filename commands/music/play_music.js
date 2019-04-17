const commando = require("discord.js-commando");
const ytdl = require("ytdl-core");
const axios = require("axios");

Play = (connection, message) => {
  var server = servers[message.guild.id];
  server.dispatcher = connection.playStream(
    ytdl(server.queue[0], { filter: "audioonly" })
  );
  server.queue.shift();
  server.dispatcher.on("end", () => {
    if (server.queue[0]) {
      Play(connection, message);
    } else {
      connection.disconnect();
    }
  });
};

YoutubeSearch = (searchKeywords, message, connection) => {
  axios
    .get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${escape(
        searchKeywords
      )}&`,
      { params: { key: process.env.YT_API_KEY } }
    )
    .then(response => {
      var body = response.data.items;
      if (body.length === 0) {
        console.log("Your search gave 0 results");
        return videoId;
      }
      QueueYtAudioStream(body[0].id.videoId, message, connection);
    })
    .catch(error => {
      console.log(error); //Axios entire error message
      console.log("Unexpected error when searching YouTube");
      return null;
    });
  return null;
};

QueueYtAudioStream = (videoId, message, connection) => {
  var server = servers[message.guild.id];
  var streamUrl = `https://www.youtube.com/watch?v=` + videoId;
  server.queue.push(streamUrl);
  console.log(server);
  Play(connection, message);
  message.channel.send(streamUrl);
};

class PlayMusicCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "play",
      group: "music",
      memberName: "play",
      description: `Play music`
    });
  }

  async run(message, args) {
    if (args === "") {
      message.reply("There is nothing to search for...");
      return;
    }
    if (message.member.voiceChannel) {
      if (!message.guild.voiceConnection) {
        if (!servers[message.guild.id]) {
          servers[message.guild.id] = { queue: [] };
        }
        message.member.voiceChannel.join().then(connection => {
          message.reply("Playing Music");
          YoutubeSearch(args, message, connection);
        });
      }
    } else {
      message.reply("You must be in a voice channel to summon me!");
    }
  }
}

module.exports = PlayMusicCommand;
