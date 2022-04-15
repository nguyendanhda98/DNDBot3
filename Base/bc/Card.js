module.exports = class Card {
  constructor(cardType, cardNumber) {
    this.cardNumber = cardNumber;
    this.cardType = cardType;
  }

  mapCard() {
    let type = null;
    switch (this.cardType) {
      case 10:
        type = "Bích";
        break;
      case 20:
        type = "Tép";
        break;
      case 30:
        type = "Cơ";
        break;
      case 40:
        type = "Rô";
        break;
      default:
        break;
    }

    return `${this.cardNumber} ${type}`;
  }
};
