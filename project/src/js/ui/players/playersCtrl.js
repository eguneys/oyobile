import socket from '../../socket';
import * as utils from '../../utils';
import * as xhr from './playerXhr';
import m from 'mithril';

export default function controller() {
  socket.createDefault();

  const players = m.prop([]);

  xhr.onlinePlayers().then(players, err => utils.handleXhrError(err));

  return {
    players,
    goToProfile(u) {
      m.route('/@/' + u);
    },
    onunload: () => {
    }
  };
}
