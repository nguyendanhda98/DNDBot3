export default class player {
  constructor(id, host, playing) {
    this.id = id;
    this.host = host;
    this.playing = playing;
    this.bets = [];
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
