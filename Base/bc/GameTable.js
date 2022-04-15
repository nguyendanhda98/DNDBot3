const { gameStatus, distributeCardsState } = require('../../util/constant')
const Card = require('./Card')
const Player = require('./Player')

module.exports = class GameTable {
    host = null
    players = []
    gameStatus = gameStatus.PENDDING
    maxPlayer = 12
    cardsExist = []
    winner = null
    distributeCardsState = distributeCardsState.NO
    constructor(host, maxPlayer = 12) {
        const newHost = new Player(host.id, host.username)
        this.host = newHost
        this.maxPlayer = maxPlayer
        this.players.push(newHost)
    }

    start(user) {
        if (this.host.id !== user.id) {
            console.log('Bạn không phải nhà cái')
            return { message: 'Bạn không phải nhà cái', success: false }
        }

        this.gameStatus = gameStatus.INPROCESS
        return {
            message: 'Trận đấu được bắt đầu, hãy nhanh tay đặt cược',
            success: true,
        }
    }
    join(user) {
        if (this.gameStatus !== gameStatus.PENDDING) {
            return {
                message: `${user.username} không thể tham gia bàn của ${this.host.username}, bàn này đang trong trò chơi.`,
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
            message: `${user.username} đã tham gia bàn của ${this.host.username}`,
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
        const player = this.players.find((player) => player.id === user.id)
        if (!player) {
            return {
                message: 'Bạn phải tham gia trò chơi',
                success: false,
            }
        }

        if (this.gameStatus !== gameStatus.INPROCESS) {
            return {
                message: 'Trò chơi chưa bắt đầu hoặc đã kết thúc',
                success: false,
            }
        }

        if (this.distributeCardsState !== distributeCardsState.NO) {
            return {
                message: 'Trò chơi đã qua giai đoạn đặt cược',
                success: false,
            }
        }

        player.betAmount = value

        return {
            message: `${player.username} vừa cược ${value} DND`,
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

        return this.players.map((player) => ({
            id: player.id,
            amonunt: player.amonunt,
        }))
    }

    checkWinner(user) {
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
            if (!this.winner) {
                player.amonunt = player.betAmount
                this.winner = player
            } else {
                if (player.getPoint() > this.winner.getPoint()) {
                    this.winner.amonunt = this.winner.betAmount * -1
                    player.amonunt = player.betAmount
                    this.winner = player
                } else if (player.getPoint() === this.winner.getPoint()) {
                    if (player.getTypePoint() > this.winner.getTypePoint()) {
                        this.winner.amonunt = this.winner.betAmount * -1
                        player.amonunt = player.betAmount
                        this.winner = player
                    } else {
                        player.amonunt = player.betAmount * -1
                    }
                } else {
                    player.amonunt = player.betAmount * -1
                }
            }
        })

        return {
            message: `Đã tìm ra người chiến thắng, đó là  ${this.winner.username}`,
            success: true,
            summary: this._getSummary(),
        }
    }
}
