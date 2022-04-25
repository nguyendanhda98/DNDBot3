const messageEmbed = require('../util/messageEmbed');
const newGame = require('../Base/baucua/newGame');
module.exports = {
  name: 'baucua',
  aliases: ['bc'],
  cooldown: 0,
  // permissions: ["ADMINISTRATOR", "MANAGE_MESSAGES", "CONNECT"],
  permissions: [],
  description: 'bau cua tom ca huou ga',
  execute(message, args, cmd, client, discord, profileData) {
    var extra = {};
    extra.setDescription = 'pong!';

    newGame(args);

    const newEmbed = messageEmbed(message, discord, extra);
    message.channel.send({ embeds: [newEmbed] });
  },
};
