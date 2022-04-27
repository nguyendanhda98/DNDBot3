import { findOne, updateUser } from '../repo/database.js';
import messageEmbed from '../util/messageEmbed.js';
export const name = 'give';
export const aliases = [];
export const permissions = [];
export const description = 'give a player some coins';
export async function execute(
  message,
  args,
  cmd,
  client,
  discord,
  profileData
) {
  var extra = {};
  if (!args.length) {
    extra = {
      setDescription: 'Bạn cần điền người nhận',
    };
  } else {
    const amount = parseInt(args[1]);
    const target = message.mentions.users.first();

    if (!target) {
      extra = {
        setDescription: 'Người nhận không tồn tại',
      };
    } else if (amount % 1 != 0 || amount <= 0) {
      extra = {
        setDescription: 'Số tiền không hợp lệ',
      };
    } else {
      const targetData = await findOne({ userID: target.id });

      if (!targetData) {
        extra = {
          setDescription: 'Người nhận chưa sử dụng DND Bot',
        };
      } else if (amount > profileData.cash) {
        extra = {
          setDescription: 'Bạn không có đủ DND',
        };
      } else {
        await updateUser(target, {
          cash: amount,
        });
        await updateUser(message.author, {
          cash: -amount,
        });
        extra = {
          setDescription: `Bạn đã tặng ${amount} DND cho ${target.tag}`,
        };
      }
    }
  }
  const newEmbed = messageEmbed(message, discord, extra);
  return message.channel.send({ embeds: [newEmbed] });
}
