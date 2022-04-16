const profileModel = require('../models/profileSchema')
const messageEmbed = require('../util/messageEmbed')
const GameTable = require('../Base/bc/GameTable')
const GameTableManagement = require('../Base/bc/GameTableManagement')
const gameTableManagement = GameTableManagement.getInstance()
module.exports = {
    name: '3cay',
    aliases: ['3cay new', ''],
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
                host = mentions.users.first()
                if (!host) {
                    extra = {
                        setDescription: `Vui lòng nhập 1 nhà cái`,
                    }
                    break
                }

                gameTable = gameTableManagement.getTableGame(host)

                if (!gameTable) {
                    extra = {
                        setDescription: `Không tìm thấy thông tin nào, ${host.username} không phải là nhà cái`,
                    }
                    break
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
                            name: 'Số lượng người chơi tối đa',
                            value: `${result.maxPlayer}`,
                            inline: true,
                        },
                        {
                            name: 'Số lượng người chơi hiện tại',
                            value: `${result.currentUserNumber}`,
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
                                : `Tham gia bàn không thành công, bạn đang ở trong bàn của nhà cái ${checkJoined.host.username}`,
                    }
                    break
                }

                if (!host) {
                    extra = {
                        setDescription: `Tham gia bàn không thành công, vui lòng nhập chủ phòng`,
                    }
                    break
                }

                gameTable = gameTableManagement.getTableGame(host)

                if (!gameTable) {
                    extra = {
                        setDescription: `Tham gia bàn không thành công, ${host.username} không phải là nhà cái.`,
                    }
                    break
                }

                result = gameTable.join(author)
                gameTableManagement.addPlayerInTable(author, host)
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
                        setDescription: `Bàn đã bị hủy do nhà cái ${author.username} đã ôm tiền chạy mất.`,
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
            case 'kick':
                break
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
                const addFields = result.playerCards.map((playerCard) => ({
                    name: playerCard.username,
                    value: playerCard.cards.join(', '),
                    inline: true,
                }))
                extra = {
                    setDescription: result.message,
                    addFields,
                }
                console.log(result.summary)
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
                break
        }

        const newEmbed = messageEmbed(message, discord, extra)
        return message.channel.send({ embeds: [newEmbed] })
    },
}
