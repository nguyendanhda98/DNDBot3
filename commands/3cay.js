const profileModel = require('../models/profileSchema')
const messageEmbed = require('../util/messageEmbed')
const GameTable = require('../Base/bc/GameTable')
const GameTableManagement = require('../Base/bc/GameTableManagement')
const gameTableManagement = GameTableManagement.getInstance()

module.exports = {
    name: '3cay',
    aliases: ['3c'],
    cooldown: 0,
    permissions: [],
    description: 'choi Ba Cay',

    async execute(message, args, cmd, client, discord, profileData) {
        var extra = {}
        console.log(cmd)
        console.log(args)
        // console.log('args', args)
        // console.log(message.author)
        // console.log(message.mentions.users.first())
        const { author, mentions } = message
        let gameTable = null
        let host = null
        let result = null
        switch (args[0]) {
            case 'info':
                const player = mentions.users.first()

                const checkInfo = (userCheck) => {
                    gameTable = gameTableManagement.getTableJoined(userCheck)

                    if (!gameTable) {
                        extra = {
                            setDescription: `Không tìm thấy thông tin nào`,
                        }

                        return
                    }

                    result = gameTable.getInfo()

                    extra = {
                        setDescription: result.message,
                        addFields: [
                            {
                                name: 'Nhà cái',
                                value: result.host.username,
                                inline: true,
                            },
                            {
                                name: 'Trạng thái',
                                value: result.gameStatus,
                                inline: true,
                            },
                            {
                                name: 'Số lượng người chơi',
                                value: `${result.currentUserNumber}/${result.maxPlayer}`,
                                inline: true,
                            },
                            {
                                name: 'Người chơi',
                                value: result.players
                                    .map(
                                        (player) =>
                                            `${player.username} (${player.betAmount})`
                                    )
                                    .join('\n'),
                            },
                        ],
                    }
                }

                if (player) {
                    checkInfo(player)
                } else {
                    gameTable = gameTableManagement.getTableJoined({
                        id: author.id,
                        username: author.username,
                    })

                    if (!gameTable) {
                        const values = []
                        for (const key in gameTableManagement.gameTables) {
                            values.push(
                                `Nhà cái ${gameTableManagement.gameTables[key].host.username} - ${gameTableManagement.gameTables[key].players.length}/${gameTableManagement.gameTables[key].maxPlayer}`
                            )
                        }

                        extra = {
                            setDescription: 'Thông tin các bàn',
                            addFields: [
                                {
                                    name: `Danh sách các nhà cái`,
                                    value:
                                        values.length > 0
                                            ? values.join('\n')
                                            : 'Không tìm thấy nhà cái nào',
                                },
                            ],
                        }
                    } else {
                        checkInfo({ id: author.id, username: author.username })
                    }
                }

                break
            case 'new': // new <Số người> <Mức cược tối thiểu> <Mức cược tốt đa>
                const maxPlayer = args[1]
                const minBet = args[2]
                const maxBet = args[3]
                host = { id: author.id, username: author.username }
                const checkGameTable = gameTableManagement.getTableJoined(host)
                if (checkGameTable) {
                    extra = {
                        setDescription: `${host.username} không thể tạo bàn vì đang ở trong bàn của ${checkGameTable.host.username}.`,
                    }
                    break
                }

                gameTable = new GameTable(host, maxPlayer, minBet, maxBet)
                gameTableManagement.addGameTable(host, gameTable)
                gameTableManagement.addPlayerInTable(host, author)
                extra = {
                    setDescription: `${host.username} vừa tạo một bàn chơi 3 cây.`,
                }
                break
            case 'join': // join <@Chủ phòng>
                host = mentions.users.first()

                const checkJoined = gameTableManagement.getTableJoined(author)

                if (checkJoined) {
                    extra = {
                        setDescription:
                            checkJoined.host.id === host.id
                                ? `${author.username} đang ở trong bàn của nhà cái ${checkJoined.host.username}`
                                : `Tham gia bàn không thành công, ${author.username} đang ở trong bàn của nhà cái ${checkJoined.host.username}`,
                    }
                    break
                }

                if (!host) {
                    extra = {
                        setDescription: `Tham gia bàn không thành công, vui lòng nhập chủ phòng`,
                    }
                    break
                }

                gameTable = gameTableManagement.getGameTable(host)

                if (!gameTable) {
                    extra = {
                        setDescription: `Tham gia bàn không thành công, ${host.username} không phải là nhà cái.`,
                    }
                    break
                }

                result = gameTable.join(author)

                if (result.success) {
                    gameTableManagement.addPlayerInTable(author, host)
                }

                extra = {
                    setDescription: result.message,
                }

                break
            case 'leave':
                gameTable = gameTableManagement.getTableJoined(author)

                if (!gameTable) {
                    extra = {
                        setDescription: `${author.username} đang không ở trong bàn nào.`,
                    }
                    break
                }

                if (author.id === gameTable.host.id) {
                    gameTable.players.forEach((player) => {
                        gameTable.leave(player)
                        gameTableManagement.removePlayerInTable(player)
                    })
                    gameTableManagement.removeTable(author)

                    extra = {
                        setDescription: `Bàn đã bị hủy do nhà cái ${author.username} đã ôm tiền chạy mất, thật quá đáng.`,
                    }
                    break
                } else {
                    gameTable.leave(author)
                    gameTableManagement.removePlayerInTable(author)
                    extra = {
                        setDescription: `${author.username} đã rời khỏi bàn của ${gameTable.host.username}.`,
                    }
                    break
                }
            case 'ready':
                host = { id: author.id, username: author.username }
                gameTable = gameTableManagement.getTableJoined(host)
                if (!gameTable) {
                    extra = {
                        setDescription: `Ready game thất bại, ${host.username} phải là nhà cái trước đã.`,
                    }
                    break
                }

                result = gameTable.ready(host)
                extra = {
                    setDescription: result.message,
                }
                break
            case 'bet': // bet <So tien>
                if (args[1] % 1 != 0 || args[1] <= 0) {
                    extra = {
                        setDescription: 'Số DND không hợp lệ!',
                    }
                    break
                }

                gameTable = gameTableManagement.getTableJoined(author)

                if (!gameTable) {
                    extra = {
                        setDescription: `Cược thất bại, ${author.username} chưa tham gia bàn của nhà cái nào.`,
                    }
                    break
                }

                result = gameTable.bet(author, args[1])
                extra = {
                    setDescription: result.message,
                }
                break
            case 'start':
                host = { id: author.id, username: author.username }

                gameTable = gameTableManagement.getTableJoined(host)

                if (!gameTable) {
                    extra = {
                        setDescription: `Bắt đầu game thất bại, ${author.username} chưa trở thành nhà cái.`,
                    }
                    break
                }

                result = gameTable.distributeCards(host)

                if (!result.success) {
                    extra = {
                        setDescription: result.message,
                    }
                    break
                }

                result = gameTable.checkWinners(host)

                extra = {
                    setDescription: 'Người chiến thắng là: ...',
                    addFields: result.playerCards.map((playerCard) => ({
                        name: playerCard.username,
                        value: playerCard.getShowCards(0).join(' '),
                        inline: true,
                    })),
                }

                const getStartEditEmbed = (numberCard) => {
                    extra.addFields = result.playerCards.map((playerCard) => ({
                        name: playerCard.username,
                        value: playerCard.getShowCards(numberCard).join(' '),
                        inline: true,
                    }))

                    response.edit({
                        embeds: [messageEmbed(message, discord, extra)],
                    })
                }

                setTimeout(() => {
                    getStartEditEmbed(1)
                    setTimeout(() => {
                        getStartEditEmbed(2)
                        setTimeout(() => {
                            extra.setDescription = `Người chiến thắng là: ${result.message}`
                            getStartEditEmbed(3)
                        }, 3000)
                    }, 2000)
                }, 1000)

                console.log(result.summary)
                break
            case 'deny':
                host = { id: author.id, username: author.username }
                const userBeKick = {
                    id: mentions.users.first().id,
                    username: mentions.users.first().username,
                }

                gameTable = gameTableManagement.getTableJoined(host)

                if (!gameTable) {
                    extra = {
                        setDescription: `Đá đít thất bại, ${host.username} chưa trở thành nhà cái.`,
                    }
                    break
                }

                result = gameTable.kick(host, userBeKick)

                extra = {
                    setDescription: result.message,
                }
                console.log('xxxxxxxxxxxxx', result)
                if (result.success) {
                    console.log('vao day')
                    gameTableManagement.removePlayerInTable(userBeKick)
                }

                break

            case 'allow':
                host = { id: author.id, username: author.username }
                const userBeAllow = {
                    id: mentions.users.first().id,
                    username: mentions.users.first().username,
                }

                gameTable = gameTableManagement.getTableJoined(host)

                if (!gameTable) {
                    extra = {
                        setDescription: `Đá đít thất bại, ${host.username} chưa trở thành nhà cái.`,
                    }
                    break
                }

                result = gameTable.allow(host, userBeAllow)

                extra = {
                    setDescription: result.message,
                }

                break
            case 'check':
                gameTable = gameTableManagement.getGameTable({ id: author.id })
                console.log('players', gameTable.players)
                console.log('players', gameTable.players)
                console.log('blackList', gameTable.blackList)
                console.log('gameTables', gameTableManagement.gameTables)
                console.log(
                    'playersInTable',
                    gameTableManagement.playersInTable
                )
                break
            default:
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
                    game.bet(user1, amount)
                    game.distributeCards(host)
                    const {
                        winners,
                        playerCards,
                        message: checkWinnersMessage,
                    } = game.checkWinners(host)

                    // extra = {
                    //     setDescription: `Người chiến thắng là: ...`,
                    //     addFields: playerCards.map((player) => ({
                    //         name: player.username,
                    //         value: `${player.getShowCards(0).join(' ')}`,
                    //         inline: true,
                    //     })),
                    // }

                    extra = {
                        setDescription: `Người chiến thắng là: ...`,
                        addFields: [
                            {
                                name: playerCards[1].username,
                                value: `${playerCards[1]
                                    .getShowCards(0)
                                    .join(' ')}`,
                                inline: true,
                            },
                            {
                                name: playerCards[0].username,
                                value: `${playerCards[0].cards.join(' ')}`,
                                inline: true,
                            },
                        ],
                    }

                    const getEditEmbed = (numberCard) => {
                        extra.addFields = [
                            {
                                name: playerCards[1].username,
                                value: `${playerCards[1]
                                    .getShowCards(numberCard)
                                    .join(' ')}`,
                                inline: true,
                            },
                            {
                                name: playerCards[0].username,
                                value: `${playerCards[0].cards.join(' ')}`,
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
                                extra.setDescription = `Người chiến thắng là: ${checkWinnersMessage}`
                                getEditEmbed(3)
                            }, 3000)
                        }, 2000)
                    }, 1000)

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
                break
        }

        const newEmbed = messageEmbed(message, discord, extra)
        let response = await message.channel.send({ embeds: [newEmbed] })
    },
}
