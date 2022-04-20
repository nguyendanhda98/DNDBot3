const messageEmbed = require('../util/messageEmbed')
const GameTable = require('../Base/bc/GameTable')
const GameTableManagement = require('../Base/bc/GameTableManagement')
const { updateUser } = require('../services/profile')
const gameTableManagement = GameTableManagement.getInstance()
const dndEmoji = process.env.DND_EMOJI
module.exports = {
    name: '3cay',
    aliases: ['3c'],
    cooldown: 0,
    permissions: [],
    description: 'choi Ba Cay',

    async execute(message, args, cmd, client, discord, profileData) {
        var extra = {}

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
                    gameTableManagement.removeTable(author)
                    gameTable.players.forEach((player) => {
                        gameTableManagement.removePlayerInTable(player)
                    })

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
                if (args[1] === 'all') {
                    args[1] = profileData.cash
                }

                if (+args[1] % 1 != 0 || +args[1] <= 0) {
                    extra = {
                        setDescription: `Số DND ${dndEmoji} không hợp lệ!`,
                    }
                    break
                }
                if (+args[1] > profileData.cash) {
                    extra = {
                        setDescription: `Số DND ${dndEmoji} của bạn không đủ!`,
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

                result = gameTable.bet(author, +args[1])
                extra = {
                    setDescription:
                        +args[1] === profileData.cash
                            ? `${author.username} vừa all in ${profileData.cash} ${dndEmoji} vào bàn của nhà cái ${this.host.username}, hảo hán .... HẢO HÁNNNNNN`
                            : result.message,
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

                const totalBetAmount = gameTable.getTotalBetAmount()

                if (totalBetAmount > profileData.cash) {
                    extra = {
                        setDescription: `Số DND ${dndEmoji} trong ví của nhà cái không đủ!`,
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
                    addFields: result.playersInfo.map((playerCard) => ({
                        name: playerCard.username,
                        value: playerCard.getShowCards(0).join(' '),
                        inline: true,
                    })),
                }

                const newEmbedMultiPlayer = messageEmbed(
                    message,
                    discord,
                    extra
                )
                const responseMultiPlayerEmbeds = await message.channel.send({
                    embeds: [newEmbedMultiPlayer],
                })

                const getStartEditEmbed = (numberCard, showAmount = false) => {
                    extra.addFields = result.playersInfo.map((playerCard) => ({
                        name: `${playerCard.username}${
                            showAmount ? `\n${playerCard.showAmount}` : ''
                        }`,
                        value: playerCard.getShowCards(numberCard).join(' '),
                        inline: true,
                    }))

                    responseMultiPlayerEmbeds.edit({
                        embeds: [messageEmbed(message, discord, extra)],
                    })
                }

                setTimeout(() => {
                    getStartEditEmbed(1)
                    setTimeout(() => {
                        getStartEditEmbed(2)
                        setTimeout(() => {
                            getStartEditEmbed(3)
                            setTimeout(() => {
                                extra.setDescription = `Người chiến thắng là: ${result.message}`
                                getStartEditEmbed(3, true)
                            }, 3000)
                        }, 4000)
                    }, 2000)
                }, 1000)

                result.playersInfo.forEach(
                    async (player) =>
                        await updateUser(player.id, { cash: player.amount })
                )
                return
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
                if (result.success) {
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
                // gameTable = gameTableManagement.getGameTable({ id: author.id })
                // console.log('players', gameTable.players)
                // console.log('players', gameTable.players)
                // gameTable.players.forEach((player) => {
                //     console.log('===============================')
                //     console.log(player.username)
                //     console.log('cards', player.cards)
                //     console.log('hight cards', player.highestCard)
                //     console.log('===============================')
                // })
                // console.log('blackList', gameTable.blackList)
                console.log('gameTables', gameTableManagement.gameTables)
                console.log(
                    'playersInTable',
                    gameTableManagement.playersInTable
                )

                break
        }

        const newEmbed = messageEmbed(message, discord, extra)
        message.channel.send({ embeds: [newEmbed] })
    },
}
