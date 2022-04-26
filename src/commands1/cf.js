import { findOneAndUpdate } from '../models/profileSchema.js';
import messageEmbed from '../util/messageEmbed.js';
export const name = "cf";
export const aliases = [];
export const cooldown = 0;
export const permissions = [];
export const description = "chicken fight game";
export async function execute(message, args, cmd, client, discord, profileData) {
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
    let response = await findOneAndUpdate(
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
      setDescription: `${message.author.username}, gà của bạn đã **thua**. Bạn bị trừ **${amount} DND**`,
    };
  }
  const newEmbed = messageEmbed(message, discord, extra);
  return message.channel.send({ embeds: [newEmbed] });
}
