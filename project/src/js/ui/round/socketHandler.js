import gameApi from '../../oyunkeyf/game';
import ground from './ground';
import * as xhr from './roundXhr';
import m from 'mithril';

export default function(ctrl) {
  return {
    move: function(o) {
      o.isMove = true;
      ctrl.apiMove(o);
      m.redraw(false, true);
    },
    reload: function() {
      xhr.reload(ctrl).then(ctrl.reload);
    },
    end: function(scores) {
      console.log(scores);
      ctrl.data.game.scores = scores.result;
      ground.end(ctrl.okeyground);
      // allow sleep again
      ctrl.saveBoard();
      // ctrl.setLoading(true);
      xhr.reload(ctrl).then(ctrl.reload);
    },
    message: function(msg) {
      if (ctrl.chat) ctrl.chat.append(msg);
    },
    crowd: function(o) {
      ['east', 'west', 'north', 'south'].forEach(function(side) {
        gameApi.setOnGame(ctrl.data, side, o[side]);
      });
      m.redraw(false, true);
      // top hooks
      ctrl.okeyground.data.renderRAF();
    }
  };
}
