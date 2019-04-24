import stream from 'mithril/stream';
import socket from '../../socket';
import { hasNetwork, noop } from '../../utils';
import redraw from '../../utils/redraw';
import { isForeground, setForeground } from '../../utils/appMode';
import { dropShadowHeader } from '../shared/common';
import { body } from './homeView';
import layout from '../layout';

export default {
  oninit() {
    const nbConnectedPlayers = stream();
    const nbGamesInPlay = stream();
    
    function init() {
      if (isForeground()) {
        socket.createLobby('homeLobby', noop, {
          n: (_, d) => {
            nbConnectedPlayers(d.d);
            nbGamesInPlay(d.r);
            redraw();
          }
        });
      }
    }

    function onResume() {
      setForeground();
      init();
    }

    if (hasNetwork()) {
      init();
    }

    document.addEventListener('online', init);
    document.addEventListener('resume', onResume);

    this.ctrl = {
      nbConnectedPlayers,
      nbGamesInPlay,
      init,
      onResume
    };
  },
  onremove() {
    socket.destroy();
    document.removeEventListener('online', this.ctrl.init);
    document.removeEventListener('resume', this.ctrl.onResume);
  },
  
  view() {
    const header = dropShadowHeader('oyunkeyf.net');

    return layout.free(header, body(this.ctrl));
  }
};
