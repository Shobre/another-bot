const commando = require("discord.js-commando");
const { Attachment } = require("discord.js");
const discord = require("discord.js");

class SendCV extends commando.Command {
  constructor(client) {
    super(client, {
      name: "hireme",
      group: "simple",
      memberName: "hireme",
      description: "Sends you my creators CV"
    });
  }

  async run(message) {
    var myInfo = new discord.RichEmbed()
      .setTitle("Charles Diep")
      .addField("About me", "I am this bots creator.", true)
      .setThumbnail(this.client.user.avatarURL)
      .setColor(0xff0000)
      .setFooter("Sent my CV to you.");
    // .setURL("https://i.imgur.com/w3duR07.png")
    // .setImage("https://i.imgur.com/w3duR07.png")

    message.channel.sendEmbed(myInfo);

    // Create the attachment using Attachment
    const cv = new Attachment("./misc/CharlesCV.pdf");
    // Send the attachment to the commander
    message.author.send(cv);
  }
}

module.exports = SendCV;
