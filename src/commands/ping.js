import messageEmbed from '../util/messageEmbed.js';

export const name = 'ping';
export const aliases = ['ping1', 'ping2', 'ping3'];
export const cooldown = 10;
export const permissions = [];
export const description = 'this is a ping command!';
export async function execute(message, args, cmd, client, discord, profileData) {
  var extra = {};
  extra.setDescription = 'pong!';
  // message.channel.send('pong!');
  const newEmbed = messageEmbed(message, discord, extra);
  message.channel.send({ embeds: [newEmbed] });
}
