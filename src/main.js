const Discord = require("discord.js");
require("dotenv").config();
const { Client, Intents } = require("discord.js");
const token = process.env.DISCORD_TOKEN;
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

["command_handler", "event_handler"].forEach((handler) => {
  require(`./handlers/${handler}`)(client, Discord);
});

const itemRepo = require("./services/item");
const invenstoryRepo = require("./services/inventory");

client.login(token);
