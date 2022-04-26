import { findOne, findOneAndUpdate } from '../models/profileSchema.js';
import messageEmbed from '../util/messageEmbed.js';
export const name = "give";
export const aliases = [];
export const permissions = [];
export const description = "give a player some coins";
export async function execute(message, args, cmd, client, discord, profileData) {
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
      const targetData = await findOne({ userID: target.id });

      if (!targetData) {
        extra = {
          setDescription: "Người nhận chưa sử dụng DND Coin",
        };
      } else if (amount > profileData.cash) {
        extra = {
          setDescription: "Bạn không có đủ DND",
        };
      } else {
        await findOneAndUpdate(
          {
            userID: target.id,
          },
          {
            $inc: {
              cash: amount,
            },
          }
        );
        await findOneAndUpdate(
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
          setDescription: `Bạn đã tặng ${amount} DND cho ${message.mentions.users.first().tag}`,
        };
      }
    }
  }
  const newEmbed = messageEmbed(message, discord, extra);
  return message.channel.send({ embeds: [newEmbed] });
}
