module.exports = class Game {
  constructor(idHost, maxPlayer = false) {
    this.host = idHost;
    this.maxPlayer = maxPlayer;
    this.member = [];
  }

  join(id) {
    this.member.push(id);
  }
};
