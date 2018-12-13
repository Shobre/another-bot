const commando = require("discord.js-commando");
const axios = require("axios");
const discord = require("discord.js");

class PvpCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "pvp",
      group: "wow",
      memberName: "pvp",
      description: `Get wow pvp ladder`
    });
  }

  async run(message, args) {
    // if (args !== "2v2" || args !== "3v3") {
    //   message.channel.send("Please choose a real bracket like 2v2 or 3v3")
    //   return;
    // }

    message.channel.send("Chill while I fetch the data...");
    pvpLadder = [];
    let pvpResults = new discord.RichEmbed().setTitle("Top 10 " + args);
    axios
      .get(
        `https://eu.api.blizzard.com/wow/leaderboard/${args}?locale=en_GB&access_token=${
          process.env.BLIZZARD_API_KEY
        }`
      )
      .then(response => {
        response.data.rows.map(player => {
          if (player.ranking <= 10) {
            pvpLadder.push(player);
          }
        });

        for (var i = 0; i < pvpLadder.length; i++) {
          let playerClass = "";
          switch (pvpLadder[i].classId) {
            case 1:
              playerClass = "Warrior";
              break;
            case 2:
              playerClass = "Paladin";
              break;
            case 3:
              playerClass = "Hunter";
              break;
            case 4:
              playerClass = "Rogue";
              break;
            case 5:
              playerClass = "Priest";
              break;
            case 6:
              playerClass = "Death Knight";
              break;
            case 7:
              playerClass = "Shaman";
              break;
            case 8:
              playerClass = "Mage";
              break;
            case 9:
              playerClass = "Warlock";
              break;
            case 10:
              playerClass = "Monk";
              break;
            case 11:
              playerClass = "Druid";
              break;
            case 12:
              playerClass = "Demon Hunter";
              break;

            default:
              break;
          }
          pvpResults.addField(
            pvpLadder[i].rating + " " + pvpLadder[i].name,
            "Class: " + playerClass,
            false
          );
        }

        message.channel.send(pvpResults);
        // console.log(pvpLadder);
      })
      .catch(error => {
        console.log(error); //Axios entire error message
        console.log("you doin wrong son");
      });
  }
}

module.exports = PvpCommand;
