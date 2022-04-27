import messageEmbed from '../util/messageEmbed.js';
import { top } from '../repo/database.js';
export const name = 'leaderboard';
export const aliases = ['lb'];
export const cooldown = 0;
export const permissions = [];
export const description = 'Server Rank';
export async function execute(
  message,
  args,
  cmd,
  client,
  discord,
  profileData
) {
  let extra = {
    setDescription: '',
    setTitle: `${message.guild.name} Top 10 Cash`,
  };

  top(10).forEach((element, index) => {
    extra.setDescription += `**${index + 1}**. ${element.userName} - ${
      element.cash
    } DND \n`;
  });

  //   extra.setDescription = 'pong!';
  // message.channel.send('pong!');

  const newEmbed = messageEmbed(message, discord, extra);
  message.channel.send({ embeds: [newEmbed] });
}
