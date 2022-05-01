export default class player {
  constructor(id, bet = false, playing = 0) {
    this.id = id;
    this.bet = bet;
    this.playing = playing;
    this.bets = [
      { name: 'bau', amount: 0 },
      { name: 'cua', amount: 0 },
      { name: 'tom', amount: 0 },
      { name: 'ca', amount: 0 },
      { name: 'nai', amount: 0 },
      { name: 'ga', amount: 0 },
    ];
    this.winAmount = 0;
  }

  getID() {
    return this.id;
  }

  newGame() {
    if (this.playing) {
      console.log(
        `Bạn đang tham gia bàn ${this.playing}. Không thể tạo bàn mới. Vui lòng rời bàn hiện tại`
      );
    } else {
      this.playing = this.id;
      this.host = true;
      console.log(`${this.id} đã tạo bàn`);
    }
  }
  joinGame(id) {
    if (this.playing) {
      console.log(
        `Bạn đang tham gia bàn ${this.playing}. Không thể tham gia bàn mới`
      );
    } else if (!id) {
      console.log('Cần điền chủ bàn');
    } else {
      console.log(`Tham gia bàn ${id} thành công`);
      this.playing = id;
    }
  }

  leaveGame() {
    if (this.playing == 0 && this.host == 0) {
      console.log('Bạn chưa tham gia bàn nào');
    } else {
      if (this.playing == 0) {
        console.log(`Bạn vừa rời khỏi bàn ${this.host}`);
        this.host = 0;
      } else {
        console.log(`Bạn vừa rời khỏi bàn ${this.playing}`);
        this.playing = 0;
      }
    }
  }
  bet(arr) {
    this.bets = arr;
  }
}
