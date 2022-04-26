const profileModel = require("../models/profileSchema");
const messageEmbed = require("../util/messageEmbed");
module.exports = {
  name: "de",
  aliases: [],
  cooldown: 0,
  permissions: [],
  description: "Chơi đề",

  async execute(message, args, cmd, client, discord, profileData) {
    const amount = args[0];
    const number = args[1];
    var extra = {};

    try {
      if (amount % 1 != 0 || amount <= 0) {
        extra = {
          setDescription: "Số DND không hợp lệ!",
        };
      } else if (amount > profileData.cash) {
        extra = {
          setDescription: "Bạn không có đủ DND trong ví",
        };
      } else if (number < 99 && number > 0) {
        const randomNumber = Math.floor(Math.random() * 99);
        if (randomNumber == number) {
          let response = await profileModel.findOneAndUpdate(
            {
              userID: message.author.id,
            },
            {
              $inc: {
                cash: amount * 70,
              },
            }
          );

          extra = {
            setDescription: `Đề về **${randomNumber}**. Bạn đã **thắng** và nhận được **${
              amount * 70
            } DND**`,
          };
        } else if (randomNumber != number) {
          let response = await profileModel.findOneAndUpdate(
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
            setDescription: `Đề về **${randomNumber}**. Bạn đã **thua** và bị trừ **${amount} DND**`,
          };
        }
      } else {
        extra = {
          setDescription: "Số cược không hợp lệ",
        };
      }
      const newEmbed = messageEmbed(message, discord, extra);
      return message.channel.send({ embeds: [newEmbed] });
    } catch (error) {
      console.log(error);
    }
  },
};
