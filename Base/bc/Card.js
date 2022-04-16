const { cardEmojis } = require('../../util/constant')
module.exports = class Card {
    constructor(cardType, cardNumber) {
        this.cardNumber = cardNumber
        this.cardType = cardType
    }

    mapCard() {
        let type = null
        switch (this.cardType) {
            case 10:
                type = 'S'
                break
            case 20:
                type = 'C'
                break
            case 30:
                type = 'H'
                break
            case 40:
                type = 'D'
                break
            default:
                break
        }

        if (!cardEmojis[`${type}${this.cardNumber}`]) {
            console.log('xxxxxxxxxxxxxxxxx', `${type}${this.cardNumber}`)
        }

        return cardEmojis[`${type}${this.cardNumber}`]
    }
}
