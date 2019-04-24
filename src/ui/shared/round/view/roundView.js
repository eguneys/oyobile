import h from 'mithril/hyperscript';
import i18n from '../../../../i18n';
import layout from '../../../layout';
import socket from '../../../../socket';
import * as helper from '../../../helper';
import * as playerApi from '../../../../oyunkeyf/player';
import gameApi from '../../../../oyunkeyf/game';
import gameStatusApi from '../../../../oyunkeyf/status';

import popupWidget from '../../../shared/popup';
import Board from '../../../shared/Board';
import GameTitle from '../../../shared/GameTitle';
import gameButton from './button';
import Clock from '../clock/clockView';
import { menuButton, headerBtns, backButton } from '../../../shared/common';

export default function view(ctrl) {

  return layout.board(
    renderHeader(ctrl),
    renderContent(ctrl),
    overlay(ctrl));

}

function overlay(ctrl) {
  return [
    renderGamePopup(ctrl)
  ];
}

function renderGameRunningActions(ctrl) {
  const gameControls = gameButton.resign(ctrl);
  
  return (
    <div className="game_controls">
      {gameControls}
    </div>
  );
}

function renderGameEndedActions(ctrl) {
  const result = gameApi.result(ctrl.data);
  const resultDom = gameStatusApi.aborted(ctrl.data) ? [] : [
    h('strong', result), h('br')
  ];

  let buttons;
  const masaId = ctrl.data.game.masaId;
  if (masaId) {
    buttons = [
      gameButton.returnToMasa(ctrl)
    ];
  }

  return (
    <div className="game_controls">
      <div className="control buttons">{buttons}</div>  
    </div>
  );
}

function renderStatus(ctrl) {
  const result = gameApi.result(ctrl.data);
  const winner = gameApi.getPlayer(ctrl.data, ctrl.data.game.winner);
  const status = ctrl.data.game.status.name;
  
  return (gameStatusApi.aborted(ctrl.data) ? [] : [
    h('strong', result), h('br')
  ]).concat([h('em.resultStatus', status)]);
}

function renderGamePopup(ctrl) {
  const header = !gameApi.playable(ctrl.data) ?
          () => renderStatus(ctrl) : undefined;
  
  return popupWidget(
    'player_controls',
    header,
    () => gameApi.playable(ctrl.data) ?
      renderGameRunningActions(ctrl) :
      renderGameEndedActions(ctrl),
    ctrl.vm.showingActions,
    ctrl.hideActions
  );
}

function renderHeader(ctrl) {
  let children;

  children = [
    menuButton(),
    renderTitle(ctrl)
  ];

  children.push(headerBtns());

  return h('nav', {
    className: socket.isConnected() ? '':'reconnecting'
  }, children);
}

function renderTitle(ctrl) {
  const data = ctrl.data;
  const masa = ctrl.data.masa;

  return h(GameTitle, {
    key: 'playing-title',
    data: ctrl.data
  });
}

function renderContent(ctrl) {
  const player = renderPlayTable(ctrl, ctrl.data.player, 'player');
  const opponentLeft = renderPlayTable(ctrl, ctrl.data.opponentLeft, 'opponentLeft');
  const opponentRight = renderPlayTable(ctrl, ctrl.data.opponentRight, 'opponentRight');
  const opponentUp = renderPlayTable(ctrl, ctrl.data.opponentUp, 'opponentUp');

  //  const bounds = helper.getBoardBounds(helper.viewportDim());
  
  const board = h(Board, {
    variant: ctrl.data.game.variant.key,
    okeyground: ctrl.okeyground,
      //    bounds
  });
  
  return h.fragment({}, [
    renderMenuActionsBar(ctrl),
    renderGameActionsBarRight(ctrl),
    player,
    opponentLeft,
    opponentRight,
    opponentUp,
    board,
  ]);
}

function renderGameActionsBarRight(ctrl) {
  return (<section className="game_actions_bar right">
          {gameButton.sortPairs(ctrl)}
          {gameButton.sortSeries(ctrl)}
          </section>);
}

function renderMenuActionsBar(ctrl) {
  const gmClass = [
    'fa', 'fa-ellipsis-v'
  ].join(' ');
  
  const gmButton = <button className={gmClass} key="gameMenu" oncreate={helper.ontap(ctrl.showActions)}/>;

  return (<section className="menu_actions_bar">
          {backButton()}
          {gmButton}
          </section>);
}

function renderPlayTable(ctrl, player, position) {
  
  const classN = 'playTable ' + position;

  return (
      <section className={classN}>
      {renderAntagonistInfo(ctrl, player, position)}
      </section>
  );
}

function renderAntagonistInfo(ctrl, player, position) {
  // const runningSide = ctrl.isClockRunning() ? ctrl.data.game.player : undefined;
  const running = ctrl.data.game.player === player.side;
  const user = player.user;
  const playerName = playerApi.playerName(player);

  return (
      <div className={'antagonistInfos'}>
        <h2 className={'antagonistUser'}>
        <span className={'fa fa-circle status ' + ((player.ai || player.onGame) ? 'ongame' : 'offgame')}/>
          {playerName}
        </h2>
      {running ? renderClock(ctrl.clock, player.side):null}
      </div>
  );

}

function renderClock(ctrl, side, runningSide) {
  return h(Clock, {
    ctrl,
    side,
    runningSide
  });
}
