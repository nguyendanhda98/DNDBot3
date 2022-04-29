import {
  game,
  pushGame,
  joinGame,
  ready,
  check,
  bet,
  start,
  getPlayer,
  findGame,
  findPlayer,
  leave,
  resetBet,
} from '../Base/baucua/game.js';
import player from '../Base/baucua/player.js';
import messageEmbed from '../util/messageEmbed.js';
import _ from 'lodash';
import { findOne } from '../repo/database.js';
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
      if (findGame(author.id)) {
        extra = {
          setDescription: 'Bạn đang là chủ phòng rồi. Không cần tạo mới',
        };
        break;
      }

      pushGame(new game(author.id));

      extra = {
        setDescription: `${author.username} vừa tạo một bàn chơi bầu cua.`,
      };
      break;

    case 'join':
      const host = message.mentions.users.first();

      if (!host) {
        extra = {
          setDescription: 'Chủ phòng không tồn tại',
        };
        break;
      }

      if (!findGame(host.id)) {
        extra = {
          setDescription: `Hiện tại không có bàn của <@${host.id}>`,
        };
        break;
      }

      if (findGame(author.id)) {
        extra = {
          setDescription: 'Bạn đang là chủ phòng. Không thể tham gia bàn khác',
        };
        break;
      }
      if (findPlayer(author.id)) {
        extra = {
          setDescription: `Bạn đang tham gia phòng <@${
            findPlayer(author.id).playing
          }>. Không thể tham gia bàn khác`,
        };
        break;
      }

      let member = new player(author.id, false, host.id);
      joinGame(member);

      break;
    // case 'ready':
    //   if (!findGame(author.id)) {
    //     extra = {
    //       setDescription: 'Bạn không phải chủ phòng. Không thể sẵn sàng!',
    //     };
    //     break;
    //   }
    //   ready(author.id);
    //   break;
    case 'bet':
      if (!findPlayer(author.id)) {
        extra = {
          setDescription: `Bạn đang tham không gia bàn nào. Không thể đặt cược!`,
        };
        break;
      }
      if (findGame(author.id)) {
        extra = {
          setDescription: `Bạn đang là chủ bàn. Không thể đặt cược!`,
        };
        break;
      }

      const name = args[1];
      const amount = parseInt(args[2]);
      const arr = ['bau', 'cua', 'tom', 'ca', 'nai', 'ga'];

      if (!arr.includes(name)) {
        extra = {
          setDescription:
            'Con vật không hợp lệ. Hãy thử với các con vật sau: `bau`,`cua`,`tom`,`ca`,`nai`,`ga`',
        };
        break;
      }

      if (amount % 1 != 0 || amount <= 0) {
        extra = {
          setDescription: 'Số tiền không hợp lệ',
        };
      }
      if (amount > profileData.cash) {
        extra = {
          setDescription: 'Bạn không có đủ DND',
        };
      }

      const betObj = { name: name, amount: amount };
      bet(author.id, betObj);
      break;
    case 'start':
      if (!findGame(author.id)) {
        extra = {
          setDescription: 'Bạn không phải chủ phòng. Không thể bắt đầu!',
        };
        break;
      }

      let result = start(author.id); //array [x1,x2,x3]

      extra = {
        setDescription: `Kết quả: ${result}`,
        addFields: [],
      };

      let currentPlayer = getPlayer(author.id);

      currentPlayer.forEach((player) => {
        const user = findOne({ userID: player.id });
        let name = `${user.userName} (${player.winAmount})`;
        let value = []; //name amount, name amount, name amount

        player.bets.forEach((bet) => {
          if (bet.amount != 0) {
            value.push(`${bet.name} ${bet.amount}`);
          }
        });

        const objPlayer = {
          name: name,
          value: _.join(value, ', '),
          inline: true,
        };
        extra.addFields.push(objPlayer);
      });
      resetBet(author.id);
      break;
    case 'leave':
      if (leave(author.id)) {
        extra = {
          setDescription: 'Rời phòng thành công',
        };
      } else {
        extra = {
          setDescription: 'Rời phòng thất bại. Bạn chưa tham gia bàn chơi nào',
        };
      }
      break;
    case 'check':
      check(author.id);
      break;
    default:
      break;
  }

  const newEmbed = messageEmbed(message, discord, extra);
  message.channel.send({ embeds: [newEmbed] });
}
