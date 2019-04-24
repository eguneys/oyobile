import gameApi from '../../../../oyunkeyf/game';

export default function ClockCtrl(d, opts) {

  this.setClock = (d, east, west, south, north) => {
    const isClockRunning = gameApi.playable(d) &&
            (d.game.turns >= 4 || (d.clock && d.clock.running));

    this.times = {
      east: east * 1000,
      west: west * 1000,
      north: north * 1000,
      south: south * 1000,
      activeSide: isClockRunning ? d.game.player : undefined,
      lastUpdate: performance.now()
    };
  };


  this.opts = opts;

  const cdata = d.clock;

  this.emergMs = cdata.emerg; // 1000 * Math.min(60, Math.max(10, cdata.emerg * .125));

  this.setClock(d, cdata.sides.east, cdata.sides.west, cdata.sides.south, cdata.sides.north);

  this.elements = {
    east: null,
    west: null,
    south: null,
    north: null
  };



  this.tick = () => {
    const side = this.times.activeSide;
    if (!side) return;

    const now = performance.now();
    const millis = this.times[side] - this.elapsed(now);
    if (millis <= 0) this.opts.onFlag();
    else this.updateElement(side, millis);
  };

  this.updateElement = (side, millis) => {
    const el = this.elements[side];
    if (el) {
      const width = Math.max(0, Math.min(100, (millis / 30000) * 100)) + '%';
      el.style.width = width;
      if (millis < this.emergMs * 4 * 1000) el.classList.add('emerg');
      else el.classList.remove('emerg');
    }
  };

  this.elapsed = (now = performance.now()) => Math.max(0, now - this.times.lastUpdate);
  
  this.millisOf = (side) => {
    return this.times.activeSide === side ?
      Math.max(0, this.times[side] - this.elapsed()) : this.times[side];
  };

  this.isRunning = () => this.times.activeSide !== undefined;

}
