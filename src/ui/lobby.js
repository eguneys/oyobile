import * as utils from '../utils';
import redraw from '../utils/redraw';
import router from '../router';
import * as xhr from '../xhr';

export default {
  startSeeking(conf) {
    doStartSeeking(conf);
  }
};

function doStartSeeking(conf) {
  // router.backbutton.stack.push(userCancelSeeking);

  sendHook(conf);
}

function sendHook(setup) {
  xhr.seekGame(setup)
    .then(data => {
      // console.log(data);
      router.set('/masa/' + data.id);
    }).catch(utils.handleXhrError);
}

// import * as utils from '../utils';
// import * as xhr from '../xhr';
// import m from 'mithril';

// let nbPlayers = 0;
// let nbGames = 0;

// const lobby = {};
// lobby.isOpen = false;

// lobby.startSeeking = function() {
//   xhr.newGame().then(function(data) {
//     // analytics
//     m.route('/masa/' + data.id);
//   }, function(error) {
//     utils.handleXhrError(error);
//     throw error;
//   });
// };


// export default lobby;
