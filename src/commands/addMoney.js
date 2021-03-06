import { findOne, updateUser } from '../repo/database.js';
import messageEmbed from '../util/messageEmbed.js';
export const name = 'add-money';
export const aliases = ['am'];
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
  if (message.member.id != '452272161390985226')
    return message.channel.send(`Xin lỗi, chỉ Admin mới dùng được lệnh này`);
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
          setDescription: 'Người nhận chưa sử dụng DND Coin',
        };
      } else {
        await updateUser(target, {
          cash: amount,
        });

        extra = {
          setDescription: `Đã cộng ${amount} DND cho ${
            message.mentions.users.first().tag
          }`,
        };
      }
    }
  }
  const newEmbed = messageEmbed(message, discord, extra);
  return message.channel.send({ embeds: [newEmbed] });
}
