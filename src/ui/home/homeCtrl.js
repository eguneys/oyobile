import socket from '../../socket';
import { lobby as lobbyXhr } from '../../xhr';
import { hasNetwork, noop, handleXhrError } from '../../utils';
import { isForeground, setForeground } from '../../utils/appMode';
import m from 'mithril';

export default function homeCtrl() {
  const nbConnectedPlayers = m.prop();
  const nbGamesInPlay = m.prop();

  function init() {
    if (isForeground()) {
      lobbyXhr(true).then(data => {
        socket.createLobby(data.lobby.version, noop, {
          n: (_, d) => {
            nbConnectedPlayers(d.d);
            nbGamesInPlay(d.r);
            m.redraw();
          }
        });
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

  return {
    nbConnectedPlayers,
    nbGamesInPlay,
    onunload() {
      socket.destroy();
      document.removeEventListener('online', init);
      document.removeEventListener('resume', onResume);
    }
  };
}
