import i18n from '../../i18n';
import layout from '../layout';
import helper from '../helper';
import newGameForm from '../newGameForm';
import { header as headerWidget } from '../shared/common';
import m from 'mithril';

export default function homeView(ctrl) {
  function body() {
    const nbPlayers = i18n('nbConnectedPlayers', ctrl.nbConnectedPlayers() || '?');
    const nbGames = i18n('nbGamesInPlay', ctrl.nbGamesInPlay() || '?');

    return (
      <div className="native_scroller page">
        <div className="home">
          <section>
            <div>{m.trust(nbPlayers.replace(/(\d+)/, '<strong>$1</strong>'))}</div>
            <div>{m.trust(nbGames.replace(/(\d+)/, '<strong>$1</strong>'))}</div>
          </section>
          <section id="homeCreate">
        <button className="fatButton" config={helper.ontouchY(newGameForm.openRealtime)}>{i18n('createAGame')}</button>
          </section>
        </div>
      </div>
    );
  }

  const header = headerWidget.bind(null, 'oyunkeyf.net');

  return layout.free(header, body);
}
