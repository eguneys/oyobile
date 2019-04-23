import redraw from '../../../utils/redraw';
import ground from './ground';

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

  redraw();

}
