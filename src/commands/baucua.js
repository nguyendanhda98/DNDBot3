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
  checkBet,
  countPlayer,
} from '../Base/baucua/game.js';
import player from '../Base/baucua/player.js';
import messageEmbed from '../util/messageEmbed.js';
import _ from 'lodash';
import { findOne } from '../repo/database.js';
import { ExtraForm } from '../util/extra.js';
import { bcEmojis } from '../util/constant.js';
export const name = 'baucua';
export const aliases = ['bc'];
export const cooldown = 0;
export const permissions = [];
export const description = 'tro choi bau cua';

// let extra = new ExtraForm();

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

      let findPlayerCheck1 = findPlayer(author.id);
      if (findPlayerCheck1) {
        extra = {
          setDescription: `Bạn đang tham gia phòng <@${findPlayerCheck1.playing}>. Không thể tạo bàn mới`,
        };
        break;
      }

      pushGame(new game(author.id));

      extra = {
        setTitle: 'Bầu Cua',
        setDescription: `Tạo phòng: \`d.bc new\`
Vào phòng: \`d.bc join <nhà cái>\`
Đặt cược: \`d.bc bet <con vật> <tiền cược>\`
Bắt đầu: \`d.bc start\`

Con vật: \`bau\`, \`cua\`, \`tom\`, \`ca\`, \`nai\`, \`ga\`
\u200B`,
        addFields: [
          {
            name: 'Nhà cái',
            value: `<@${author.id}>`,
            inline: false,
          },
          {
            name: 'Người chơi',
            value: 'Kết quả: ... ... ...',
            inline: true,
          },
        ],
        // setDescription: `${author.username} vừa tạo một bàn chơi bầu cua.`,
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
      let findPlayerCheck2 = findPlayer(author.id);
      if (findPlayerCheck2) {
        extra = {
          setDescription: `Bạn đang tham gia phòng <@${findPlayerCheck2.playing}>. Không thể tham gia bàn khác`,
        };
        break;
      }

      let member = new player(author.id, false, host.id);
      joinGame(member);

      if (findPlayer(author.id)) {
        extra = {
          setTitle: 'Bầu Cua',
          setDescription: `Tạo phòng: \`d.bc new\`
Vào phòng: \`d.bc join <nhà cái>\`
Đặt cược: \`d.bc bet <con vật> <tiền cược>\`
Bắt đầu: \`d.bc start\`

Con vật: \`bau\`, \`cua\`, \`tom\`, \`ca\`, \`nai\`, \`ga\`
\u200B`,
          addFields: [
            {
              name: 'Nhà cái',
              value: `<@${findPlayer(author.id).playing}>`,
              inline: false,
            },
            {
              name: 'Người chơi',
              value: 'Kết quả: ... ... ...',
              inline: false,
            },
          ],
          // setDescription: `${author.username} vừa tạo một bàn chơi bầu cua.`,
        };
      }
      // extra = {
      //   setDescription: `Bàn trống`,
      //   addFields: [{ name: '\u200B', value: 'Kết quả: ... ... ...', inline: false }],
      // };

      let currentPlayerInfo1 = countPlayer(author.id);
      if (!currentPlayerInfo1) {
        extra = {
          setDescription: `Bạn hiện tại đang không tham gia bàn nào. Không thể kiểm tra thông tin phòng`,
        };
        break;
      }
      // let flag = false;
      currentPlayerInfo1.forEach((player) => {
        // flag = true;
        // extra.setDescription = 'Đặt cược thôi';
        const user = findOne({ userID: player.id });
        let name = `${user.userName} (${player.winAmount})`;
        let value = [];

        player.bets.forEach((bet) => {
          if (bet.amount != 0) {
            let name = bet.name;
            switch (name) {
              case 'bau':
                name = bcEmojis.bau;
                break;
              case 'cua':
                name = bcEmojis.cua;
                break;
              case 'tom':
                name = bcEmojis.tom;
                break;
              case 'ca':
                name = bcEmojis.ca;
                break;
              case 'nai':
                name = bcEmojis.nai;
                break;
              case 'ga':
                name = bcEmojis.ga;
                break;
            }

            value.push(`${name} ${bet.amount}`);
          }
        });

        if (value.length == 0) {
          value.push('Đang đặt cược...');
        }

        const objPlayer = {
          name: name,
          value: _.join(value, ', '),
          inline: true,
        };
        extra.addFields.push(objPlayer);
      });

      // if (flag) {
      //   extra.addFields.shift();
      // }

      break;

    case 'bet':
      if (findGame(author.id)) {
        extra = {
          setDescription: `Bạn đang là chủ bàn. Không thể đặt cược!`,
        };
        break;
      }
      if (!findPlayer(author.id)) {
        extra = {
          setDescription: `Bạn đang tham không gia bàn nào. Không thể đặt cược!`,
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

      if (findPlayer(author.id)) {
        extra = {
          setTitle: 'Bầu Cua',
          setDescription: `Tạo phòng: \`d.bc new\`
Vào phòng: \`d.bc join <nhà cái>\`
Đặt cược: \`d.bc bet <con vật> <tiền cược>\`
Bắt đầu: \`d.bc start\`

Con vật: \`bau\`, \`cua\`, \`tom\`, \`ca\`, \`nai\`, \`ga\`
\u200B`,
          addFields: [
            {
              name: 'Nhà cái',
              value: `<@${findPlayer(author.id).playing}>`,
              inline: false,
            },
            {
              name: 'Người chơi',
              value: 'Kết quả: ... ... ...',
              inline: false,
            },
          ],
          // setDescription: `${author.username} vừa tạo một bàn chơi bầu cua.`,
        };
      }
      // extra = {
      //   setDescription: `Bàn trống`,
      //   addFields: [{ name: '\u200B', value: 'Kết quả: ... ... ...', inline: false }],
      // };

      let currentPlayerInfo2 = countPlayer(author.id);
      if (!currentPlayerInfo2) {
        extra = {
          setDescription: `Bạn hiện tại đang không tham gia bàn nào. Không thể kiểm tra thông tin phòng`,
        };
        break;
      }
      // let flag = false;
      currentPlayerInfo2.forEach((player) => {
        // flag = true;
        // extra.setDescription = 'Đặt cược thôi';
        const user = findOne({ userID: player.id });
        let name = `${user.userName} (${player.winAmount})`;
        let value = [];

        player.bets.forEach((bet) => {
          if (bet.amount != 0) {
            let name = bet.name;
            switch (name) {
              case 'bau':
                name = bcEmojis.bau;
                break;
              case 'cua':
                name = bcEmojis.cua;
                break;
              case 'tom':
                name = bcEmojis.tom;
                break;
              case 'ca':
                name = bcEmojis.ca;
                break;
              case 'nai':
                name = bcEmojis.nai;
                break;
              case 'ga':
                name = bcEmojis.ga;
                break;
            }

            value.push(`${name} ${bet.amount}`);
          }
        });

        if (value.length == 0) {
          value.push('Đang đặt cược...');
        }

        const objPlayer = {
          name: name,
          value: _.join(value, ', '),
          inline: true,
        };
        extra.addFields.push(objPlayer);
      });

      // if (flag) {
      //   extra.addFields.shift();
      // }

      break;

      break;
    case 'start':
      if (!findGame(author.id)) {
        extra = {
          setDescription: 'Bạn không phải chủ phòng. Không thể bắt đầu!',
        };
        break;
      }

      if (getPlayer(author.id).length == 0) {
        extra = {
          setDescription: 'Chưa có ai tham gia bàn. Không thể bắt đầu!',
        };
        break;
      }

      let checkBetArr = checkBet(author.id);
      let userNotBet = [];
      if (checkBetArr.length > 0) {
        checkBetArr.forEach((user) => {
          userNotBet.push(findOne({ userID: user.id }).userName);
        });

        extra = {
          setDescription: `${userNotBet.join(
            ', '
          )} chưa đặt cược. Không thể bắt đầu!`,
        };
        break;
      }

      let result = await start(author.id); //array [x1,x2,x3]

      extra = {
        setTitle: 'Bầu Cua',
        setDescription: `Tạo phòng: \`d.bc new\`
Vào phòng: \`d.bc join <nhà cái>\`
Đặt cược: \`d.bc bet <con vật> <tiền cược>\`
Bắt đầu: \`d.bc start\`

Con vật: \`bau\`, \`cua\`, \`tom\`, \`ca\`, \`nai\`, \`ga\`
\u200B`,
        addFields: [
          {
            name: 'Nhà cái',
            value: `<@${author.id}>`,
            inline: false,
          },
          {
            name: 'Người chơi',
            value: `Kết quả: ${result}`,
            inline: false,
          },
        ],
        // setDescription: `${author.username} vừa tạo một bàn chơi bầu cua.`,
      };

      let currentPlayer = getPlayer(author.id);

      currentPlayer.forEach((player) => {
        const user = findOne({ userID: player.id });
        let name = `${user.userName} (${player.winAmount})`;
        let value = []; //name amount, name amount, name amount

        player.bets.forEach((bet) => {
          if (bet.amount != 0) {
            let name = bet.name;
            switch (name) {
              case 'bau':
                name = bcEmojis.bau;
                break;
              case 'cua':
                name = bcEmojis.cua;
                break;
              case 'tom':
                name = bcEmojis.tom;
                break;
              case 'ca':
                name = bcEmojis.ca;
                break;
              case 'nai':
                name = bcEmojis.nai;
                break;
              case 'ga':
                name = bcEmojis.ga;
                break;
            }

            value.push(`${name} ${bet.amount}`);
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
    case 'info':
      if (findGame(author.id)) {
        extra = {
          setTitle: 'Bầu Cua',
          setDescription: `Tạo phòng: \`d.bc new\`
Vào phòng: \`d.bc join <nhà cái>\`
Đặt cược: \`d.bc bet <con vật> <tiền cược>\`
Bắt đầu: \`d.bc start\`

Con vật: \`bau\`, \`cua\`, \`tom\`, \`ca\`, \`nai\`, \`ga\`
\u200B`,
          addFields: [
            {
              name: 'Nhà cái',
              value: `<@${author.id}>`,
              inline: false,
            },
            {
              name: 'Người chơi',
              value: 'Kết quả: ... ... ...',
              inline: false,
            },
          ],
          // setDescription: `${author.username} vừa tạo một bàn chơi bầu cua.`,
        };
      }
      if (findPlayer(author.id)) {
        extra = {
          setTitle: 'Bầu Cua',
          setDescription: `Tạo phòng: \`d.bc new\`
Vào phòng: \`d.bc join <nhà cái>\`
Đặt cược: \`d.bc bet <con vật> <tiền cược>\`
Bắt đầu: \`d.bc start\`

Con vật: \`bau\`, \`cua\`, \`tom\`, \`ca\`, \`nai\`, \`ga\`
\u200B`,
          addFields: [
            {
              name: 'Nhà cái',
              value: `<@${findPlayer(author.id).playing}>`,
              inline: false,
            },
            {
              name: 'Người chơi',
              value: 'Kết quả: ... ... ...',
              inline: false,
            },
          ],
          // setDescription: `${author.username} vừa tạo một bàn chơi bầu cua.`,
        };
      }
      // extra = {
      //   setDescription: `Bàn trống`,
      //   addFields: [{ name: '\u200B', value: 'Kết quả: ... ... ...', inline: false }],
      // };

      let currentPlayerInfo = countPlayer(author.id);
      if (!currentPlayerInfo) {
        extra = {
          setDescription: `Bạn hiện tại đang không tham gia bàn nào. Không thể kiểm tra thông tin phòng`,
        };
        break;
      }
      // let flag = false;
      currentPlayerInfo.forEach((player) => {
        // flag = true;
        // extra.setDescription = 'Đặt cược thôi';
        const user = findOne({ userID: player.id });
        let name = `${user.userName} (${player.winAmount})`;
        let value = [];

        player.bets.forEach((bet) => {
          if (bet.amount != 0) {
            let name = bet.name;
            switch (name) {
              case 'bau':
                name = bcEmojis.bau;
                break;
              case 'cua':
                name = bcEmojis.cua;
                break;
              case 'tom':
                name = bcEmojis.tom;
                break;
              case 'ca':
                name = bcEmojis.ca;
                break;
              case 'nai':
                name = bcEmojis.nai;
                break;
              case 'ga':
                name = bcEmojis.ga;
                break;
            }

            value.push(`${name} ${bet.amount}`);
          }
        });

        if (value.length == 0) {
          value.push('Đang đặt cược...');
        }

        const objPlayer = {
          name: name,
          value: _.join(value, ', '),
          inline: true,
        };
        extra.addFields.push(objPlayer);
      });

      // if (flag) {
      //   extra.addFields.shift();
      // }

      break;

    default:
      extra = {
        setDescription:'Lệnh không hợp lệ'
      };
      break;
  }

  const newEmbed = messageEmbed(message, discord, extra);
  message.channel.send({ embeds: [newEmbed] });
}
