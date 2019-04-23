import redraw from '../../../utils/redraw';
import ground from './ground';
import gameApi from '../../../oyunkeyf/game';
import ClockCtrl from './clock/ClockCtrl';

export default function OnlineRound(id, cfg) {
  const setData = (cfg) => {
    this.data = cfg;
  };
  
  this.id = id;
  setData(cfg);
  
  this.okeyground = ground.make(
    this.data,
    cfg.game.fen,
  );

  this.clock = this.data.clock ? new ClockCtrl(this.data, {
    onFlag: this.outoftime
  }) : null;

  if (this.clock) {
    const tickNow = () => {
      this.clock && this.clock.tick();
      if (gameApi.playable(this.data)) this.clockTimeoutId = setTimeout(tickNow, 100);
    };
    this.clockTimeoutId = setTimeout(tickNow, 100);
  }

  this.unload = () => {
    clearTimeout(this.clockTimeoutId);
  };

  redraw();

}
