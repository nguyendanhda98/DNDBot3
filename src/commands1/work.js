const userSchema = require('../models/userSchema');
const messageEmbed = require('../util/messageEmbed');

module.exports = {
  name: 'work',
  aliases: ['w'],
  cooldown: 30,
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