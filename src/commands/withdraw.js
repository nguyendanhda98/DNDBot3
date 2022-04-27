import { updateUser } from '../repo/database.js';
import messageEmbed from '../util/messageEmbed.js';
export const name = 'withdraw';
export const aliases = ['with'];
export const permissions = [];
export const description = 'withdraw coins from your bank';
export async function execute(
  message,
  args,
  cmd,
  client,
  discord,
  profileData
) {
  const amount = parseInt(args[0]);
  if (amount % 1 != 0 || amount <= 0)
    return message.channel.send('Không thể rút vì số DND không hợp lệ!');

  if (amount > profileData.bank)
    return message.channel.send(`Bạn không có đủ DND để rút`);

  await updateUser(message, {
    cash: amount,
    bank: -amount,
  });

  const extra = {
    setDescription: `Bạn đã rút **${amount} DND** từ ngân hàng`,
  };

  const newEmbed = messageEmbed(message, discord, extra);

  return message.channel.send({ embeds: [newEmbed] });
}
