/*
 * SI_Card_Bot — Discord bot for Spirit Island card and spirit panel lookups.
 *
 * Original author: Carlo I Gonzalez "SpeedyOlrac"
 * Extended/maintained by: ChihTang Chang "pochu0083"
 *
 * Features:
 *   - Card search (power, minor, major, unique, blight, event, fear)
 *   - Spirit, adversary, aspect, scenario, incarna panels
 *   - Random spirit, adversary, double, scenario, board
 *   - FAQ links, invader/fear deck, progression
 *   - Chinese support (繁體/简体) via data CSVs; -aid [base|je|ni] for player aids
 *   - Data updatable from card_db.csv (see data/README.md)
 *
 * Version: 2.9.0 (extended)
 */

require("dotenv").config();
const fs = require("fs");
const Discord = require("discord.js");

const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  ActivityType,
} = require("discord.js");
const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel, Partials.Message],
});

const PREFIX = "-";

bot.commands = new Collection();

const commandFiles = fs
  .readdirSync("./commands/")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  //if(command.public){
  bot.commands.set(command.name, command);
  //}
}

bot.once("ready", async () => {
  console.log("This bot is online");

  // Set bot's presence
  bot.user.setPresence({
    activities: [{ name: `for -help`, type: ActivityType.Watching }],
    status: "for -help",
  });

  console.log(bot.commands.get("spirit").name);
});

bot.on("messageCreate", async (msg) => {
  if (!msg.content.startsWith(PREFIX)) return;

  let args = msg.content.slice(PREFIX.length).trim().split(" ");
  let command = args.shift().toLowerCase();
  console.log(command);

  // if (!isNaN(parseInt(command))) {
  //     args = [command]
  //     command = "choose"
  // }
  //

  if (!bot.commands.has(command)) return console.log("command not in list");

  try {
    await bot.commands.get(command).execute(msg, args, Discord);
  } catch (error) {
    console.error(error);
  }
});

bot.login();
