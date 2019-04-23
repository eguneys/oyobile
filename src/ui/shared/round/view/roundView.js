import h from 'mithril/hyperscript';
import i18n from '../../../../i18n';
import layout from '../../../layout';
import socket from '../../../../socket';
import * as playerApi from '../../../../oyunkeyf/player';
import Board from '../../../shared/Board';
import GameTitle from '../../../shared/GameTitle';
import Clock from '../clock/clockView';
import { menuButton, headerBtns, backButton } from '../../../shared/common';

export default function view(ctrl) {

  return layout.board(
    renderHeader(ctrl),
    renderContent(ctrl),
    overlay(ctrl));

}

function overlay(ctrl) {
  return [];
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
    player,
    opponentLeft,
    opponentRight,
    opponentUp,
    board,
  ]);
}

function renderMenuActionsBar(ctrl) {
  return (<section className="menu_actions_bar">
          {backButton()}
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
  const user = player.user;
  const playerName = playerApi.playerName(player);

  return (
      <div className={'antagonistInfos'}>
        <h2 className={'antagonistUser'}>
          <span className={'fa fa-circle status ' + (player.onGame ? 'ongame' : 'offgame')}/>
          {playerName}
        </h2>
        {renderClock(ctrl.clock, player.side)}
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
