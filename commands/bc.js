const profileModel = require("../models/profileSchema");
const messageEmbed = require("../util/messageEmbed");
module.exports = {
  name: "bc",
  aliases: [],
  cooldown: 0,
  permissions: [],
  description: "choi Ba Cay",

  async execute(message, args, cmd, client, discord, profileData) {
    const amount = args[0];
    const randomNumber = Math.floor(Math.random() * 2) + 1;
    var extra = {};
    if (amount % 1 != 0 || amount <= 0) {
      extra = {
        setDescription: "Số DND không hợp lệ!",
      };
    } else if (amount > profileData.cash) {
      extra = {
        setDescription: "Bạn không có đủ DND trong ví",
      };
    } else if (randomNumber == 1) {
      let response = await profileModel.findOneAndUpdate(
        {
          userID: message.author.id,
        },
        {
          $inc: {
            cash: amount,
          },
        }
      );
      extra = {
        setDescription: `${message.author.username}, gà của bạn đã **thắng**. Bạn nhận được **${amount} DND**`,
      };
    } else if (randomNumber == 2) {
      await profileModel.findOneAndUpdate(
        {
          userID: message.author.id,
        },
        {
          $inc: {
            cash: -amount,
          },
        }
      );

      extra = {
        setDescription: `${message.author.username}, gà của bạn đã **thua**. Bạn bị trừ **${amount} DND**`,
      };
    }
    const newEmbed = messageEmbed(message, discord, extra);
    return message.channel.send({ embeds: [newEmbed] });
  },
};

const typeCard = {
  ro: 40,
  co: 30,
  tep: 20,
  bich: 10,
};

class Card {
  constructor(cardNumber, cardType) {
    this.cardNumber = cardNumber;
    this.cardType = cardType;
  }
}

class PlayerHand {
  cards = [];
  highestCard = null;
  constructor(userId) {
    this.userId = userId;
  }

  addCard(card) {
    this.cards.push(card);
    findHighestCard(card);
  }

  findHighestCard(card) {
    if (!this.highestCard) {
      this.highestCard = card;
    } else {
      this.highestCard =
        card.cardNumber + card.typeCard >
        this.highestCard.cardNumber + this.highestCard.typeCard
          ? card
          : this.highestCard;
    }
  }

  checkExistCard(card) {
    const card = this.cards(
      (item) =>
        item.cardNumber === card.cardNumber && item.cardType === card.cardType
    );

    if (card) {
      return true;
    } else {
      return false;
    }
  }

  getPoint() {
    const totalPoint = this.cards.reduce(
      (totalPoint, item) => totalPoint + item.cardNumber,
      0
    );

    return totalPoint % 10;
  }

  getTypePoint() {
    const totalTypePoint = this.cards.reduce(
      (totalTypePoint, item) => totalTypePoint + item.cardNumber,
      0
    );
  }
}
