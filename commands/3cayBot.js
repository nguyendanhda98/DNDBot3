const messageEmbed = require('../util/messageEmbed')
const GameTable = require('../Base/bc/GameTable')
const GameTableManagement = require('../Base/bc/GameTableManagement')
const { updateUser } = require('../services/profile')
const gameTableManagement = GameTableManagement.getInstance()
const dndEmoji = process.env.DND_EMOJI
module.exports = {
    name: '3caybot',
    aliases: ['3cb'],
    cooldown: 10,
    permissions: [],
    description: 'choi Ba Cay',

    async execute(message, args, cmd, client, discord, profileData) {
        var extra = {}

        const amount = args[0]
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
            game.ready(host)
            game.bet(user1, +amount)
            game.distributeCards(host)
            const {
                winners,
                playersInfo,
                message: checkWinnersMessage,
            } = game.checkWinners(host)

            // extra = {
            //     setDescription: `Người chiến thắng là: ...`,
            //     addFields: playersInfo.map((player) => ({
            //         name: player.username,
            //         value: `${player.getShowCards(0).join(' ')}`,
            //         inline: true,
            //     })),
            // }

            extra = {
                setDescription: `Người chiến thắng là: ...`,
                addFields: [
                    {
                        name: playersInfo[1].username,
                        value: `${playersInfo[1].getShowCards(0).join(' ')}`,
                        inline: true,
                    },
                    {
                        name: playersInfo[0].username,
                        value: `${playersInfo[0].cards.join(' ')}`,
                        inline: true,
                    },
                ],
            }

            const newEmbed = messageEmbed(message, discord, extra)
            const response = await message.channel.send({ embeds: [newEmbed] })

            const getEditEmbed = (numberCard, showAmount = false) => {
                extra.addFields = [
                    {
                        name: `${playersInfo[1].username}${
                            showAmount ? `\n${playersInfo[1].showAmount}` : ''
                        }`,

                        value: `${playersInfo[1]
                            .getShowCards(numberCard)
                            .join(' ')}`,
                        inline: true,
                    },
                    {
                        name: `${playersInfo[0].username}${
                            showAmount ? `\n${playersInfo[0].showAmount}` : ''
                        }`,
                        value: `${playersInfo[0].cards.join(' ')}`,
                        inline: true,
                    },
                ]
                response.edit({
                    embeds: [messageEmbed(message, discord, extra)],
                })
            }

            setTimeout(() => {
                getEditEmbed(1)
                setTimeout(() => {
                    getEditEmbed(2)
                    setTimeout(() => {
                        getEditEmbed(3)
                        setTimeout(() => {
                            extra.setDescription = `Người chiến thắng là: ${checkWinnersMessage}`
                            getEditEmbed(3, true)
                        }, 2000)
                    }, 3000)
                }, 2000)
            }, 1000)

            if (winners.length === 0) {
                await updateUser(message.author.id, {
                    cash: +amount * -1,
                })
            } else {
                await updateUser(message.author.id, { cash: +amount })
            }
        }
    },
}
