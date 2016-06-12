import m from 'mithril';

export default function ctrl(data, outOfTime, soundSide, redrawBoard) {
  var lastUpdate = {};

  this.data = data;
  this.data.barTime = Math.max(this.data.initial, 2);

  function setLastUpdate() {
    lastUpdate = {
      east: data.sides['east'],
      west: data.sides['west'],
      north: data.sides['north'],
      south: data.sides['south'],
      at: new Date()
    };
  }
  setLastUpdate();

  this.update = (sides) => {
    this.data.sides = sides;
    setLastUpdate();
  };

  this.tick = (side) => {
    this.data.sides[side] =
      Math.max(0, lastUpdate[side] - (new Date() - lastUpdate.at) / 1000);
    if (this.data.sides[side] === 0) outOfTime();
    redrawBoard();
  };
}
