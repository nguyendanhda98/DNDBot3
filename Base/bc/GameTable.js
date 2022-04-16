const { gameStatus, distributeCardsState } = require('../../util/constant')
const Card = require('./Card')
const Player = require('./Player')

module.exports = class GameTable {
    host = null
    players = []
    gameStatus = gameStatus.PENDDING
    maxPlayer = 12
    cardsExist = []
    winners = []
    distributeCardsState = distributeCardsState.NO
    constructor(host, maxPlayer = 12) {
        const newHost = new Player(host.id, host.username)
        this.host = newHost
        this.maxPlayer = maxPlayer
        this.players.push(newHost)
    }

    getInfo() {
        return {
            host: this.host,
            players: this.players,
            gameStatus: this.gameStatus,
            currentUserNumber: this.players.length,
            maxPlayer: this.maxPlayer,
        }
    }

    ready(user) {
        if (this.host.id !== user.id) {
            return {
                message: `Ready thất bại, ${user.username} không phải là nhà cái, nhà cái của  ${user.username} là ${this.host.username}`,
                success: false,
            }
        }

        if (this.gameStatus === gameStatus.INPROCESS) {
            return {
                message: `Không thể ready, bàn của nhà cái ${this.host.username} đang trong quá trình đặt cược rồi`,
                success: false,
            }
        }

        if (this.players.length < 2) {
            return {
                message: `Không thể ready, bàn của nhà cái ${this.host.username} mới có 1 người chơi`,
                success: false,
            }
        }

        this.gameStatus = gameStatus.INPROCESS
        return {
            message: `Trận đấu của nhà cái ${this.host.username} được bắt đầu, hãy nhanh tay đặt cược`,
            success: true,
        }
    }
    join(user) {
        const checkExistUser = this.players.find(
            (player) => player.id === user.id
        )

        if (checkExistUser) {
            return {
                message: `${user.username} đang tham gia bàn của nhà cái ${this.host.username} rồi.`,
                success: false,
            }
        }

        if (this.gameStatus !== gameStatus.PENDDING) {
            return {
                message: `${user.username} không thể tham gia bàn của nhà cái ${this.host.username}, bàn này đang trong trò chơi.`,
                success: false,
            }
        }

        if (this.players.length >= this.maxPlayer) {
            return {
                message: `${user.username} không thể tham gia bàn của ${this.host.username}, bàn này đã đầy.`,
                success: true,
            }
        }

        this.players.push(new Player(user.id, user.username))
        return {
            message: `${user.username} đã tham gia bàn của nhà cái ${this.host.username}`,
            success: true,
        }
    }

    leave(user) {
        let playerIndex = -1
        this.players.find((player, index) => {
            if (player.id === user.id) {
                playerIndex = index
                return player
            }
        })
        this.players.splice(playerIndex, 1)
        return {
            message: `${user.username} đã rời khỏi bàn của ${this.host.username}`,
            success: true,
        }
    }

    checkExistCard(cardType, cardNumber) {
        const newCard = this.cardsExist.find(
            (item) =>
                item.cardNumber === cardNumber && item.cardType === cardType
        )

        if (newCard) {
            return true
        } else {
            return false
        }
    }

    randomCard() {
        const cardNumberRandom = Math.floor(Math.random() * 9) + 1
        const cardTypeRandom = (Math.floor(Math.random() * 4) + 1) * 10
        const checkExistCard = this.checkExistCard(
            cardTypeRandom,
            cardNumberRandom
        )

        if (!checkExistCard) {
            return new Card(cardTypeRandom, cardNumberRandom)
        }
        return this.randomCard()
    }

    bet(user, value) {
        if (user.id === this.host.id) {
            return {
                message: `${user.username} đang là nhà cái, không thể cược được`,
                success: false,
            }
        }

        const player = this.players.find((player) => player.id === user.id)
        if (!player) {
            return {
                message: `${user.username} phải tham gia một bàn thì mới cược được`,
                success: false,
            }
        }

        if (this.gameStatus !== gameStatus.INPROCESS) {
            return {
                message: `Bàn của nhà cái ${this.host.username} chưa sẵn sàng`,
                success: false,
            }
        }

        if (this.distributeCardsState !== distributeCardsState.NO) {
            return {
                message: `Bàn của nhà cái ${this.host.username} đã qua giai đoạn đặt cược`,
                success: false,
            }
        }

        player.betAmount = value

        return {
            message: `${player.username} vừa cược ${value} vào bàn của nhà cái ${this.host.username} DND`,
            success: true,
        }
    }

    _takeCard() {
        if (this.gameStatus !== gameStatus.INPROCESS) {
            return {
                message: `Bạn phải chạy trò chơi`,
                success: false,
            }
        }
        this.players.forEach((player) => {
            const card = this.randomCard()
            this.cardsExist.push(card)
            player.addCard(card)
        })
    }

    distributeCards(user) {
        if (user.id !== this.host.id) {
            return {
                message: `Bạn đéo phải là nhà cái`,
                success: false,
            }
        }

        if (this.gameStatus !== gameStatus.INPROCESS) {
            return {
                message: `Bạn phải chạy trò chơi`,
                success: false,
            }
        }

        if (this.distributeCards === distributeCardsState.INPROCESS) {
            return {
                message: `Chờ chút, nhà cái đang chia bài`,
                success: false,
            }
        }

        if (this.distributeCards === distributeCardsState.YES) {
            return {
                message: `Nhà cái đã chia bài xong`,
                success: false,
            }
        }

        this.distributeCardsState = distributeCardsState.INPROCESS

        this._takeCard()
        this._takeCard()
        this._takeCard()

        this.distributeCardsState = distributeCardsState.YES
        return { message: 'Nhà cái đã chia bài xong', success: true }
    }

    _getSummary() {
        this.players.forEach((player) => {
            if (player.id !== this.host) {
                this.host.amonunt += player.amonunt * -1
            }
        })

        const summary = this.players.map((player) => ({
            id: player.id,
            amonunt: player.amonunt,
        }))

        this.players.forEach((player) => {
            player.resetInfo()
        })

        this.winners = []

        return summary
    }

    checkWinners(user) {
        if (user.id !== this.host.id) {
            return {
                message: `Bạn đéo phải là nhà cái`,
                success: false,
            }
        }

        if (this.gameStatus !== gameStatus.INPROCESS) {
            return {
                message: `Vui lòng chờ chia bài xong đã, k phải vội vàng`,
                success: false,
            }
        }
        if (this.distributeCardsState !== distributeCardsState.YES) {
            return {
                message: `Vui lòng chờ chia bài xong đã, k phải vội vàng`,
                success: false,
            }
        }

        this.players.forEach((player) => {
            if (player.id !== this.host.id) {
                if (player.getPoint() > this.host.getPoint()) {
                    player.amonunt = player.betAmount
                    this.winners.push(player)
                } else if (player.getPoint() === this.host.getPoint()) {
                    if (player.getTypePoint() > this.host.getTypePoint()) {
                        player.amonunt = player.betAmount
                        this.winners.push(player)
                    } else {
                        player.amonunt = player.betAmount * -1
                    }
                } else {
                    player.amonunt = player.betAmount * -1
                }
            }
        })
        this.gameStatus = gameStatus.PENDDING
        this.distributeCardsState = distributeCardsState.NO
        const newWinners = JSON.parse(JSON.stringify(this.winners))
        return {
            message:
                this.winners.length === 0
                    ? `Đã tìm ra người chiến thắng: ${this.host.username}`
                    : `Đã tìm ra người chiến thắng: ${this.winners
                          .map((winner) => winner.username)
                          .join(', ')}`,
            success: true,
            winners: newWinners,
            playerCards: this.players.map((player) => ({
                id: player.id,
                username: player.username,
                cards: player.getCards(),
            })),
            summary: this._getSummary(),
        }
    }
}