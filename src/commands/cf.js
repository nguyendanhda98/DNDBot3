import { updateUser } from '../repo/database.js';
import messageEmbed from '../util/messageEmbed.js';
export const name = 'cf';
export const aliases = [];
export const cooldown = 0;
export const permissions = [];
export const description = 'chicken fight game';
export async function execute(
  message,
  args,
  cmd,
  client,
  discord,
  profileData
) {
  const amount = parseInt(args[1]);
  const headtail = args[0];

  const randomNumber = Math.ceil(Math.random() * 2);
  var extra = {};
  if (amount % 1 != 0 || amount <= 0) {
    extra = {
      setDescription: 'Số DND không hợp lệ!',
    };
  } else if (amount > profileData.cash) {
    extra = {
      setDescription: 'Bạn không có đủ DND trong ví',
    };
  } else if (randomNumber == 1 && (headtail == 'head' || headtail == 'h')) {
    await updateUser(message.author, { cash: amount });
    extra = {
      setDescription: `${message.author.username}, kết quả là **head**. Bạn **thắng** và nhận được **${amount} DND**`,
    };
  } else if (randomNumber == 2 && (headtail == 'tail' || headtail == 't')) {
    await updateUser(message.author, { cash: amount });
    extra = {
      setDescription: `${message.author.username}, kết quả là **tail**. Bạn **thắng** và nhận được **${amount} DND**`,
    };
  } else if (randomNumber == 2 && (headtail == 'head' || headtail == 'h')) {
    await updateUser(message.author, { cash: -amount });
    extra = {
      setDescription: `${message.author.username}, kết quả là **tail**. Bạn **thua** và mất **${amount} DND**`,
    };
  } else if (randomNumber == 1 && (headtail == 'tail' || headtail == 't')) {
    await updateUser(message.author, { cash: -amount });
    extra = {
      setDescription: `${message.author.username}, kết quả là **head**. Bạn **thua** và mất **${amount} DND**`,
    };
  }
  const newEmbed = messageEmbed(message, discord, extra);
  return message.channel.send({ embeds: [newEmbed] });
}
