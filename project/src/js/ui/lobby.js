import * as utils from '../utils';
import * as xhr from '../xhr';
import m from 'mithril';

let nbPlayers = 0;
let nbGames = 0;

const lobby = {};
lobby.isOpen = false;

lobby.startSeeking = function() {
  xhr.newGame().then(function(data) {
    // analytics
    m.route('/masa/' + data.id);
  }, function(error) {
    utils.handleXhrError(error);
    throw error;
  });
};


export default lobby;
