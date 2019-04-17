const Commando = require("discord.js-commando");
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
    ["language", "Language"],
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

bot.login(process.env.BOT_TOKEN);
