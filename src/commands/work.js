import userSchema from '../models/userSchema.js';
import { updateUser } from '../repo/database.js';
import messageEmbed from '../util/messageEmbed.js';

export const name = 'work';
export const aliases = ['w'];
export const cooldown = 0;
export const permissions = [];
export const description = 'work for DND';

export async function execute(
  message,
  args,
  cmd,
  client,
  discord,
  profileData
) {
  const randomNumber = Math.floor(Math.random() * 6) + 1;
  await updateUser(message.author, { cash: randomNumber });

  const extra = {
    setDescription: `Bạn đã làm việc rất chăm chỉ và nhận được **${randomNumber} DND**`,
  };

  const newEmbed = messageEmbed(message, discord, extra);

  return message.channel.send({ embeds: [newEmbed] });
}
