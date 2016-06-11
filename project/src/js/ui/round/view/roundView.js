import m from 'mithril';
import okeyground from 'okeyground-mobile';
import i18n from '../../../i18n';
import * as utils from '../../../utils';
import layout from '../../layout';
import helper from '../../helper';
import { menuButton } from '../../shared/common';
import chat from '../chat';
import button from './button';
import gameApi from '../../../oyunkeyf/game';
import gameStatus from '../../../oyunkeyf/status';
import Board from '../../shared/Board';
import Zanimo from 'zanimo';


export default function view(ctrl) {
  const isPortrait = helper.isPortrait();

  return layout.board(
    () => renderHeader(ctrl),
    () => renderContent(ctrl, isPortrait),
    () => overlay(ctrl)
  );
}

function overlay(ctrl) {
  return [
    ctrl.chat ? chat.view(ctrl.chat) : null
  ];
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
    <div class="replay">
      {renderResult(ctrl)}
    </div>
  );
}

function renderResult(ctrl) {
  var result;
  if (gameStatus.finished(ctrl.data)) switch(ctrl.data.game.winner) {
      default:
      result = i18n('gameEnded');
      break;
  }

  if (result || gameStatus.aborted(ctrl.data)) {
    var winner = gameApi.getPlayer(ctrl.data, ctrl.data.game.winner);
    return [
      m('p.result', result),
      m('p.status', [
        winner ? ', ' + i18n('isVictorous'): null
      ])
    ];
  }
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
    'action_bar_vbutton',
    ctrl.chat && ctrl.chat.unread ? 'glow' : ''
  ].join(' ');
  const chatButton = ctrl.chat ?
                     <button className={chatClass} data-icon="c"
                             key="chat"
  config={helper.ontouch(ctrl.chat.open)}/> : null;

  return (
    <section className="actions_bar_vertical" key="game-actions-bar">
      {button.leaveTaken(ctrl)}
      {button.collectOpen(ctrl)}
      {button.openPairs(ctrl)}
      {button.openSeries(ctrl)}
      {button.followUp(ctrl)}
      {chatButton}
      {gmButton}
    </section>
  );
}
