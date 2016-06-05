import * as xhr from './roundXhr';
import m from 'mithril';

export default function(ctrl) {
  return {
    move: function(o) {
      ctrl.apiMove(o);
      m.redraw(false, true);
    },
    reload: function() {
      xhr.reload(ctrl).then(ctrl.reload);
    },
    end: function(winner) {
      console.log('end');
    }
  };
}
