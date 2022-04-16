const profileModel = require('../models/profileSchema')
const messageEmbed = require('../util/messageEmbed')
const GameTable = require('../Base/bc/GameTable')
module.exports = {
    name: '3cay',
    aliases: ['3cay new', ""],
    cooldown: 0,
    permissions: [],
    description: 'choi Ba Cay',

    async execute(message, args, cmd, client, discord, profileData) {


switch (cmd) {
  case value:
    "3cay new";

    break;
  case value:
    "3cay new";

    break;
  default:
    break;
}

        const amount = args[0]
        const randomNumber = Math.floor(Math.random() * 2) + 1

        var extra = {}
        //kiem tra DND
        if (amount % 1 != 0 || amount <= 0) {
            extra = {
                setDescription: 'Số DND không hợp lệ!',
            }
        } else if (amount > profileData.cash) {
            extra = {
                setDescription: 'Bạn không có đủ DND trong ví',
            }
        } else {
            const host = { id: 'bot', username: 'bot' }
            const user1 = {
                id: message.author.id,
                username: message.author.username,
            }

            const game = new GameTable(host, 2)

            game.join(user1)
            game.start(host)
            game.bet(user1, amount)
            game.distributeCards(host)
            const {
                winners,
                playerCards,
                message: checkWinnersMessage,
            } = game.checkWinners(host)

            extra = {
                setDescription: `${checkWinnersMessage}
        Bot: ${playerCards[0].cards}
        Player: ${playerCards[1].cards}
        `,
            }
            if (winners.length === 0) {
                await profileModel.findOneAndUpdate(
                    {
                        userID: message.author.id,
                    },
                    {
                        $inc: {
                            cash: -amount,
                        },
                    }
                )
            } else {
                await profileModel.findOneAndUpdate(
                    {
                        userID: message.author.id,
                    },
                    {
                        $inc: {
                            cash: amount,
                        },
                    }
                )
            }
        }
        const newEmbed = messageEmbed(message, discord, extra)
        return message.channel.send({ embeds: [newEmbed] })
    },
}
