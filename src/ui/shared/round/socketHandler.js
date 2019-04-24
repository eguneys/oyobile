import redraw from '../../../utils/redraw';
import gameApi from '../../../oyunkeyf/game';
import ground from './ground';

export default function(ctrl) {
  function reload(o) {
  }

  const handlers = {
    crowd(o) {
      ['east', 'west', 'north', 'south'].forEach((side) => {
        gameApi.setOnGame(ctrl.data, side, o[side]);
      });
      redraw();
    },
    move(o) {
      o.isMove = true;
      ctrl.apiMove(o);
    },
    end(scores) {
      ctrl.data.game.scores = scores.result;
      ground.end(ctrl.okeyground);
      ctrl.endWithData(scores);
    }
  };

  return handlers;
}
