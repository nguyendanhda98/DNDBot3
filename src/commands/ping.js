const messageEmbed = require("../util/messageEmbed");

module.exports = {
  name: 'ping',
  aliases: ['ping1', 'ping2', 'ping3'],
  cooldown: 10,
  // permissions: ["ADMINISTRATOR", "MANAGE_MESSAGES", "CONNECT"],
  permissions: [],
  description: 'this is a ping command!',
  async execute(message, args, cmd, client, discord, profileData) {
    var extra = {};
    extra.setDescription = 'pong!';
    // message.channel.send('pong!');
    const newEmbed = messageEmbed(message, discord, extra);
    message.channel.send({ embeds: [newEmbed] });
  },
};
