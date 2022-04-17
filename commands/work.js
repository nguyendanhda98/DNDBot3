const profileModel = require('../models/profileSchema');
const messageEmbed = require('../util/messageEmbed');
const { updateUser } = require('../services/profile');
module.exports = {
  name: 'work',
  aliases: ['w'],
  cooldown: 0,
  permissions: [],
  description: 'work for DND',
  async execute(message, args, cmd, client, discord, profileData) {
    const randomNumber = Math.floor(Math.random() * 6) + 1;
    await updateUser(message.author.id, {
      cash: randomNumber,
    });

    const extra = {
      setDescription: `Bạn đã làm việc rất chăm chỉ và nhận được **${randomNumber} DND**`,
    };

    const newEmbed = messageEmbed(message, discord, extra);

    return message.channel.send({ embeds: [newEmbed] });
  },
};
