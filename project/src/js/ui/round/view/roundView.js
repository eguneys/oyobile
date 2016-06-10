import m from 'mithril';
import okeyground from 'okeyground-mobile';
import i18n from '../../../i18n';
import * as utils from '../../../utils';
import layout from '../../layout';
import helper from '../../helper';
import { menuButton } from '../../shared/common';
import button from './button';
import Board from '../../shared/Board';
import Zanimo from 'zanimo';


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
        {menuButton()}
        {gameInfos(ctrl)}
      </header>
      {renderReplay(ctrl)}
      {renderGameActionsBar(ctrl)}
    </section>,
    board
  ];
}

function renderReplay(ctrl) {
  return (
    <div class="replay"/>
  );
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
  const gmClass = (['fa',
                    'fa-ellipsis-h']).concat([
                      'action_bar_vbutton'
                    ]).join(' ');
  const gmButton =
  <button className={gmClass} key="gameMenu" />;

  const chatClass = [
    'action_bar_vbutton'
  ].join(' ');
  const chatButton = ctrl.chat ?
                     <button className={chatClass} data-icon="c" key="chat"/> : null 

  return (
    <section className="actions_bar_vertical" key="game-actions-bar">
      {button.leaveTaken(ctrl)}
      {button.collectOpen(ctrl)}
      {button.openPairs(ctrl)}
      {button.openSeries(ctrl)}
      {chatButton}
      {gmButton}
    </section>
  );
}
