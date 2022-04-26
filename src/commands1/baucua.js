import messageEmbed from '../util/messageEmbed.js';
import newGame from '../Base/baucua/newGame.js';
export const name = 'baucua';
export const aliases = ['bc'];
export const cooldown = 0;
export const permissions = [];
export const description = 'bau cua tom ca huou ga';
export function execute(message, args, cmd, client, discord, profileData) {
  var extra = {};
  extra.setDescription = 'pong!';

  newGame(args);

  const newEmbed = messageEmbed(message, discord, extra);
  message.channel.send({ embeds: [newEmbed] });
}
