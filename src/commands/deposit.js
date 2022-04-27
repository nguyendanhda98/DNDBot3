import { updateUser } from '../repo/database.js';
import messageEmbed from '../util/messageEmbed.js';
export const name = 'deposit';
export const aliases = ['dep'];
export const permissions = [];
export const description = 'Deposit coins into your bank!';
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
    return message.channel.send('Số DND không hợp lệ!');

  if (amount > profileData.cash)
    return message.channel.send(`Bạn không có đủ DND`);
  await updateUser(message.author, {
    cash: -amount,
    bank: amount,
  });

  const extra = {
    setDescription: `Bạn đã gửi **${amount} DND** vào ngân hàng của bạn`,
  };

  const newEmbed = messageEmbed(message, discord, extra);
  return message.channel.send({ embeds: [newEmbed] });
}
