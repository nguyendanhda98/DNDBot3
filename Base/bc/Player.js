module.exports = class Player {
    id = null
    username = null
    cards = []
    highestCard = null
    betAmount = 0
    amonunt = 0
    constructor(userId, username) {
        this.id = userId
        this.username = username
    }

    addCard(card) {
        this.cards.push(card)
        this.findHighestCard(card)
    }

    findHighestCard(card) {
        if (!this.highestCard) {
            this.highestCard = card
        } else {
            this.highestCard =
                card.cardNumber + card.typeCard >
                this.highestCard.cardNumber + this.highestCard.typeCard
                    ? card
                    : this.highestCard
        }
    }

    checkExistCard(card) {
        const newCard = this.cards(
            (item) =>
                item.cardNumber === card.cardNumber &&
                item.cardType === card.cardType
        )

        if (newCard) {
            return true
        } else {
            return false
        }
    }

    getPoint() {
        const totalPoint = this.cards.reduce(
            (totalPoint, item) => totalPoint + item.cardNumber,
            0
        )

        return totalPoint % 10 == 0 ? 10 : totalPoint % 10
    }

    getTypePoint() {
        return this.highestCard.cardNumber === 1
            ? this.highestCard.typeCard + 10
            : this.highestCard.typeCard + this.highestCard.cardNumber
    }

    getCards() {
        return this.cards.map((card) => card.mapCard())
    }
}
