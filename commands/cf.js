const profileModel = require("../models/profileSchema");
const messageEmbed = require("../util/messageEmbed");
module.exports = {
  name: "cf",
  aliases: [],
  cooldown: 0,
  permissions: [],
  description: "chicken fight game",

  async execute(message, args, cmd, client, discord, profileData) {
    const amount = args[0];
    const randomNumber = Math.floor(Math.random() * 2) + 1;
    var extra = {};
    if (amount % 1 != 0 || amount <= 0) {
      extra = {
        setDescription: "Số DND không hợp lệ!",
      };
    } else if (amount > profileData.cash) {
      extra = {
        setDescription: "Bạn không có đủ DND trong ví",
      };
    } else if (randomNumber == 1) {
      let response = await profileModel.findOneAndUpdate(
        {
          userID: message.author.id,
        },
        {
          $inc: {
            cash: amount,
          },
        }
      );
      extra = {
        setDescription: `${message.author.username}, gà của bạn đã **thắng**. Bạn nhận được **${amount} DND**`,
      };
    } else if (randomNumber == 2) {
      await profileModel.findOneAndUpdate(
        {
          userID: message.author.id,
        },
        {
          $inc: {
            cash: -amount,
          },
        }
      );

      extra = {
        setDescription: `${message.author.username}, gà của bạn đã **thua**. Bạn bị trừ **${amount} DND**`,
      };
    }
    const newEmbed = messageEmbed(message, discord, extra);
    return message.channel.send({ embeds: [newEmbed] });
  },
};
