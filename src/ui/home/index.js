import stream from 'mithril/stream';
import controller from './homeCtrl';
import { dropShadowHeader } from '../shared/common';
import { body } from './homeView';
import layout from '../layout';

export default {
  oninit() {
    const nbConnectedPlayers = stream();
    const nbGamesInPlay = stream();
    
    this.ctrl = {
      nbConnectedPlayers,
      nbGamesInPlay
    };
  },
  
  view() {
    const header = dropShadowHeader('oyunkeyf.net');

    return layout.free(header, body(this.ctrl));
  }
};
