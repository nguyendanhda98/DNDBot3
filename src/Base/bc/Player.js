import Card from './Card.js';

export default class Player {
    id = null
    username = null
    cards = []
    highestCard = null
    betAmount = 0
    amount = 0
    showAmount = '+0'
    constructor(userId, username) {
        this.id = userId
        this.username = username
    }

    getShowCard(cardIndex) {
        const cards = []
        for (let index = 0; index < 3; index++) {
            if (index < cardIndex) {
                cards.push(this.cards[index])
            } else {
                cards.push(new Card())
            }
        }

        return cards.map((card) => card.mapCard())
    }

    resetInfo() {
        this.cards = []
        this.highestCard = null
        this.amount = 0
        this.betAmount = 0
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
                (card.cardNumber === 1
                    ? 10 + card.cardType
                    : card.cardNumber + card.cardType) >
                (this.highestCard.cardNumber === 1
                    ? 10 + this.highestCard.cardType
                    : this.highestCard.cardNumber + this.highestCard.cardType)
                    ? card
                    : this.highestCard
        }
    }

    checkExistCard(card) {
        const newCard = this.cards.find(
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
