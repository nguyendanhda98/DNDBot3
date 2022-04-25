module.exports = class Game {
  constructor(idHost, maxPlayer = false) {
    this.host = idHost;
    this.maxPlayer = maxPlayer;
    this.members = [];
  }

  join(mem) {
    this.members.push(mem);
  }
  start() {
    const x1 = Math.ceil(Math.random() * 6);
    const x2 = Math.ceil(Math.random() * 6);
    const x3 = Math.ceil(Math.random() * 6);

    console.log(x1, x2, x3);

    this.members.forEach((mem) => {
      mem.bets.forEach((bet) => {
        let flag = false;
        if (bet.name == x1) {
          mem.winAmount += bet.amount;
          flag = true;
        }
        if (bet.name == x2) {
          mem.winAmount += bet.amount;
          flag = true;
        }
        if (bet.name == x3) {
          mem.winAmount += bet.amount;
          flag = true;
        }
        if (!flag) {
          mem.winAmount -= bet.amount;
        }
      });
      console.log(mem);
    });
  }
};
