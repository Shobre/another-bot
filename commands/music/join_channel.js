const commando = require("discord.js-commando");
const ytdl = require("ytdl-core");

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

class JoinChannelCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "join",
      group: "music",
      memberName: "join",
      description: `Joins the voice channel of the commander`
    });
  }

  async run(message) {
    if (message.member.voiceChannel) {
      if (!message.guild.voiceConnection) {
        if (!servers[message.guild.id]) {
          servers[message.guild.id] = { queue: [] };
        }
        message.member.voiceChannel.join().then(connection => {
          var server = servers[message.guild.id];
          message.reply("Successfully Joined!");
          server.queue.push(args)
          AnimationPlaybackEvent(connection, message);
        });
      }
    } else {
      message.reply("You must be in a voice channel to summon me!");
    }
  }
}

module.exports = JoinChannelCommand;
