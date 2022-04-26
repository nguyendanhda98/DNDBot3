'use strict';

import Discord, { Collection } from 'discord.js';
import { Client, Intents } from 'discord.js';
import 'dotenv/config';

const token = process.env.DISCORD_TOKEN;
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.commands = new Collection();
client.events = new Collection();

['command_handler', 'event_handler'].forEach((handler) => {
  import(`./handlers/${handler}.js`).then((module) => {
    module.default(client, Discord);
  });
});

 client.login(token);
