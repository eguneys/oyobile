import m from 'mithril';
import okeyground from 'okeyground-mobile';
import i18n from '../../../i18n';
import * as utils from '../../../utils';
import layout from '../../layout';
import helper from '../../helper';
import button from './button';
import Board from '../../shared/Board';


export default function view(ctrl) {
  const isPortrait = helper.isPortrait();

  return layout.board(
    () => renderHeader(ctrl),
    () => renderContent(ctrl, isPortrait)
  );
}

function renderHeader(ctrl) { return null; }

function renderContent(ctrl, isPortrait) {
  const bounds = utils.getBoardBounds(helper.viewportDim(), isPortrait, helper.isIpadLike(), 'game');
  const board = Board(
    ctrl,
    ctrl.okeyground,
    bounds,
    isPortrait,
    null
  );

  return [
    <section key="table" className="table">
      <header key="table-header" className="tableHeader">
        {gameInfos(ctrl)}
      </header>
      {renderGameActionsBar(ctrl)}
    </section>,
    board
  ];
}

function gameInfos(ctrl) {
  const data = ctrl.data;

  // const roundString = gameApi.roundsOrScores(data);
  const mode = data.game.rated ? i18n('rated'): i18n('casual');
  const icon = utils.gameIcon(data.game.perf);
  const variant = m('span.variant', {
  }, data.game.variant.name);
  const infos = [variant, m('br'), mode];
  return [
    m('div.icon-game', {
      'data-icon': icon ? icon : ''
    }),
    m('div.game-title.no_select', infos)
  ];
}

function renderGameActionsBar(ctrl) {
  return (
    <section className="actions_bar_vertical" key="game-actions-bar">
      {button.openSeries(ctrl)}
      {button.openPairs(ctrl)}
      {button.leaveTaken(ctrl)}
      {button.collectOpen(ctrl)}
    </section>
  );
}
