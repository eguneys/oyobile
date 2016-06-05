import { hasNetwork, handleXhrError } from '../../utils';
import { game as gameXhr } from '../../xhr';
import roundCtrl from '../round/roundCtrl';
import m from 'mithril';

export default function controller() {
  var gameData;
  var round;

  if (hasNetwork()) {
    gameXhr(m.route.param('id')).then(function(data) {
      gameData = data;
      
      round = new roundCtrl(data);
      
    }, function(error) {
      handleXhrError(error);
      m.route('/');
    });
  }

  return {
    getRound: function() {
      return round;
    }
  };
}
