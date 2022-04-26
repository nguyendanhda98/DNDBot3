export default class userSchema {
  constructor(userName, userID, serverID, cash = 0, bank = 0) {
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
  findOne(obj) {
    console.log('ok ne');
  }
}
