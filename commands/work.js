const profileModel = require("../models/profileSchema");
const messageEmbed = require("../util/messageEmbed");
module.exports = {
  name: "work",
  aliases: ["w"],
  cooldown: 0,
  permissions: [],
  description: "work for DND",
  async execute(message, args, cmd, client, discord, profileData) {
    const randomNumber = Math.floor(Math.random() * 6) + 1;
    const response = await profileModel.findOneAndUpdate(
      {
        userID: message.author.id,
      },
      {
        $inc: {
          cash: randomNumber,
        },
      }
    );

    const extra = {
      setDescription: `Bạn đã làm việc rất chăm chỉ và nhận được **${randomNumber} DND**`,
    };

    const newEmbed = messageEmbed(message, discord, extra);

    return message.channel.send({ embeds: [newEmbed] });
  },
};
