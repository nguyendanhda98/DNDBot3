import { game } from './game.js';
import player from './player.js';
import messageEmbed from '../../util/messageEmbed.js';
import { joinGame, pushGame } from './gameManagement.js';
export const name = 'baucua';
export const aliases = ['bc'];
export const cooldown = 0;
export const permissions = [];
export const description = 'tro choi bau cua';
export async function execute(
  message,
  args,
  cmd,
  client,
  discord,
  profileData
) {
  let extra = {};
  const { author, mentions } = message;
  // message.channel.send('pong!');

  switch (args[0]) {
    case 'new':
      let host = new player(author.id, true, author.id);
      let newGame = new game(author.id);
      newGame.pushGame(newGame);

      extra = {
        setDescription: `${author.username} vừa tạo một bàn chơi bầu cua.`,
      };
      break;
    case 'join':
      let member = new player(
        author.id,
        false,
        message.mentions.users.first().id
      );
      game.joinGame(member);
      break;
      case 'ready':
        
        break;
    default:
      break;
  }

  const newEmbed = messageEmbed(message, discord, extra);
  message.channel.send({ embeds: [newEmbed] });
}
