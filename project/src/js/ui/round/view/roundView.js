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
import popupWidget from '../../shared/popup';
import Zanimo from 'zanimo';

const { util } = okeyground;
const { partial } = util;

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
    ctrl.chat ? chat.view(ctrl.chat) : null,
    renderGamePopup(ctrl)
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
    board,
    <section key="table" className="table">
      <header key="table-header" className="tableHeader">
        {menuButton()}
        {gameInfos(ctrl)}
      </header>
      {renderReplay(ctrl)}
      {renderGameActionsBar(ctrl)}
    </section>
  ];
}

function renderReplay(ctrl) {
  const gmClass = (['fa',
                    'fa-ellipsis-h']).concat([
                      'game_bar_button'
                    ]).join(' ');
  const gmButton =
  <button className={gmClass} key="gameMenu" config={helper.ontouch(ctrl.showActions)}/>;

  const chatClass = [
    'game_bar_button',
    ctrl.chat && ctrl.chat.unread ? 'glow' : ''
  ].join(' ');
  const chatButton = ctrl.chat ?
                     <button className={chatClass} data-icon="c"
  key="chat"
                             config={helper.ontouch(ctrl.chat.open)}/> : null;


  return (
    <div class="replay">
      {gmButton}
      {chatButton}
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
  return (
    <section className="game_actions_bar" key="game-actions-bar">
      {button.leaveTaken(ctrl)}
      {button.collectOpen(ctrl)}
      {button.openPairs(ctrl)}
      {button.openSeries(ctrl)}
      {button.followUp(ctrl)}
    </section>
  );
}


function renderGamePopup(ctrl) {
  return popupWidget(
    'player_controls',
    () => gameInfos(ctrl),
    gameApi.playable(ctrl.data) ?
      () => renderGameRunningActions(ctrl) :
          () => renderGameEndedActions(ctrl),
    ctrl.vm.showingActions,
    ctrl.hideActions
  );
}

function renderGameRunningActions(ctrl) {
  const gameControls = [
      button.returnToMasa(ctrl)
  ];

  return (
    <div className="game_controls">
      {gameControls}
    </div>
  );
}

function renderGameEndedActions(ctrl) {
  const nbHand = ctrl.data.game.roundAt + 1;
  const result = gameApi.result(ctrl.data);
  const winner = gameApi.getPlayer(ctrl.data, ctrl.data.game.winner);
  const status = gameStatus.toLabel(ctrl.data.game.status.name, ctrl.data.game.winner, ctrl.data.game.variant.key);
  const resultDOM = gameStatus.aborted(ctrl.data) ? [] : [
    m('strong', `${nbHand}. ` + result), m('br')
  ];

  resultDOM.push(m('em.resultStatus', status));
  let buttons = null;
  if (ctrl.data.game.masaId) {
    buttons = [
      button.returnToMasa(ctrl),
      button.withdrawFromMasa(ctrl)
    ];
  }

  return (
    <div className="game_controls">
      <div className="result">{resultDOM}</div>
      {renderScores(ctrl)}
      <div className="control buttons">{buttons}</div>
    </div>
  );
}

function renderScores(ctrl) {
  var d = ctrl.data;
  var sides = ['east', 'west', 'north', 'south'];
  var scores = sides.map(side => {
    return {
      player: gameApi.getPlayer(d, side),
      scores: d.game.scores ? d.game.scores[side] : { scores: [] },
      opens: d.game.oscores ? d.game.oscores[side] : null
    };
  });

  var tableBody = scores.map(partial(duzPlayerTr, ctrl));

    return (
      <div className="crosstable">
        <table>
          <thead><tr></tr></thead>
          <tbody>{tableBody}</tbody>
        </table>
      </div>
    );
}

function duzPlayerTr(ctrl, { player, scores }) {
  const mySide = ctrl.data.player.side;

  const trClass = helper.classSet({
    'me': player.side === mySide
  });

  return (
    <tr key={player.side} className={trClass}>
      <th className="score">{scores.total}</th>
      <th className="user">{utilPlayer(player, 'a')}</th>
    </tr>);
}


function utilPlayer(p, tag) {
  var fullName = p.user ? p.user.username : (p.ai ? i18n('aiBot', p.ai) : i18n(p.side));
  var attrs = {
    class: 'user_link'
  };
  if (p.user && p.user.username) attrs[tag === 'a' ? 'href' : 'data-href'] = '/@/' + p.user.username;
  return {
    tag: tag,
    attrs: attrs,
    children: fullName
  };
}
