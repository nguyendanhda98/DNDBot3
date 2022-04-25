const profileModel = require("../models/profileSchema");
const messageEmbed = require("../util/messageEmbed");
module.exports = {
  name: "give",
  aliases: [],
  permissions: [],
  description: "give a player some coins",
  async execute(message, args, cmd, client, discord, profileData) {
    // if (message.member.id != "206231395989716992")
    //   return message.channel.send(
    //     `Sorry only **Alesh** can run this command 😔`
    //   );
    var extra = {};
    if (!args.length) {
      extra = {
        setDescription: "Bạn cần điền người nhận",
      };
    } else {
      const amount = args[1];
      const target = message.mentions.users.first();

      if (!target) {
        extra = {
          setDescription: "Người nhận không tồn tại",
        };
      } else if (amount % 1 != 0 || amount <= 0) {
        extra = {
          setDescription: "Số tiền không hợp lệ",
        };
      } else {
        const targetData = await profileModel.findOne({ userID: target.id });

        if (!targetData) {
          extra = {
            setDescription: "Người nhận chưa sử dụng DND Coin",
          };
        } else if (amount > profileData.cash) {
          extra = {
            setDescription: "Bạn không có đủ DND",
          };
        } else {
          await profileModel.findOneAndUpdate(
            {
              userID: target.id,
            },
            {
              $inc: {
                cash: amount,
              },
            }
          );
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
            setDescription: `Bạn đã tặng ${amount} DND cho ${
              message.mentions.users.first().tag
            }`,
          };
        }
      }
    }
    const newEmbed = messageEmbed(message, discord, extra);
    return message.channel.send({ embeds: [newEmbed] });
  },
};
