import player from '../Base/baucua/player.js';
import messageEmbed from '../util/messageEmbed.js';
import _ from 'lodash';
import { baucuaBot } from '../Base/baucua/game.js';
import { bcEmojis } from '../util/constant.js';

export const name = 'baucuaBot';
export const aliases = ['bcb'];
export const cooldown = 0;
export const permissions = [];
export const description = 'Bau cua Bot';
export async function execute(
  message,
  args,
  cmd,
  client,
  discord,
  profileData
) {
  // message.channel.send('pong!');

  let extra = {};
  const { author } = message;
  // message.channel.send('pong!');

  const betValues = _.chunk(args, 2); //Array
  const arr = ['bau', 'cua', 'tom', 'ca', 'nai', 'ga'];

  let newPlayer = new player(author.id);
  for (let e of betValues) {
    const name = e[0];
    const amount = parseInt(e[1]);

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
      break;
    }
    if (amount > profileData.cash) {
      extra = {
        setDescription: 'Bạn không có đủ DND',
      };
      break;
    }
    _.find(newPlayer.bets, { name: name }).amount = amount;
  }

  let result = await baucuaBot(newPlayer); //arr

  extra = {
    setTitle: 'Bầu Cua Bot',
    setDescription: `Chơi với Bot: \`d.bc <con vật> <tiền cược>\`
Con vật: ${bcEmojis.bau}\`bau\`, ${bcEmojis.cua}\`cua\`, ${bcEmojis.tom}\`tom\`, ${bcEmojis.ca}\`ca\`, ${bcEmojis.nai}\`nai\`, ${bcEmojis.ga}\`ga\`
\u200B`,
    addFields: [
      {
        name: 'Kết quả',
        value: `${_.join(result, ' ')}`,
        inline: false,
      },
    ],
    // setDescription: `${author.username} vừa tạo một bàn chơi bầu cua.`,
  };

  let name = `${author.username} (${newPlayer.winAmount})`;
  let value = []; //name amount, name amount, name amount
    newPlayer.bets.forEach((bet) => {
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

  const newEmbed = messageEmbed(message, discord, extra);
  message.channel.send({ embeds: [newEmbed] });
}
