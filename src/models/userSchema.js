export default class userSchema {
  constructor(tag, userName, userID, serverID, cash = 0, bank = 0) {
    this.tag = tag;
    this.userName = userName;
    this.userID = userID;
    this.serverID = serverID;
    this.cash = cash;
    this.bank = bank;
  }

  updateCash(cash) {
    this.cash += cash;
  }
  updateBank(bank) {
    this.bank += bank;
  }

}
