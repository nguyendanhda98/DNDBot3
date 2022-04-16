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

    resetInfo() {
        this.cards = []
        this.highestCard = null
        this.amonunt = 0
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
                card.cardNumber === 1
                    ? 10 + card.cardType
                    : card.cardNumber + card.cardType >
                          this.highestCard.cardNumber ===
                      1
                    ? 10 + this.highestCard.cardType
                    : this.highestCard.cardNumber + this.highestCard.cardType
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
            ? this.highestCard.cardType + 10
            : this.highestCard.cardType + this.highestCard.cardNumber
    }

    getCards() {
        return this.cards.map((card) => card.mapCard())
    }
}
