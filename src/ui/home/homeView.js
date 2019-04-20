import i18n from '../../i18n';
import layout from '../layout';
import helper from '../helper';
import { renderQuickSetup } from '../newGameForm';
import newGameForm from '../newGameForm';
import { header as headerWidget } from '../shared/common';
import m from 'mithril';

export function body(ctrl) {
  const nbPlayers = i18n('nbConnectedPlayers', ctrl.nbConnectedPlayers() || '?');
  const nbGames = i18n('nbGamesInPlay', ctrl.nbGamesInPlay() || '?');

  return (
      <div className="native_scroller page">
        <div className="home">
          <section className="stats">
            <div className="numPlayers">{nbPlayers}</div>
            <div className="numGames">{nbGames}</div>
          </section>
      { renderQuickGame() }
        </div>
      </div>
  );

  // const header = headerWidget.bind(null, 'oyunkeyf.net');

  // return layout.free(header, body);
}

function renderQuickGame() {
  return h('div.homeCreate', [
    h('h2.homeTitle', 'Hemen oyna'),
    renderQuickSetup(() => newGameForm.openRealtime('custom'))
  ]);
}
