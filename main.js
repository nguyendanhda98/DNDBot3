const Discord = require("discord.js");
require("dotenv").config();
const { Client, Intents } = require("discord.js");
const token = process.env.DISCORD_TOKEN;
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
const mongoose = require("mongoose");
//abc
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

["command_handler", "event_handler"].forEach((handler) => {
  require(`./handlers/${handler}`)(client, Discord);
});

const itemRepo = require("./services/item");
const invenstoryRepo = require("./services/inventory");

mongoose
  .connect(process.env.MONGODB_SRV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log(err);
  });

client.login(token);
