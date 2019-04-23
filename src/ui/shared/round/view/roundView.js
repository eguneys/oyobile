import h from 'mithril/hyperscript';
import layout from '../../../layout';
import socket from '../../../../socket';
import Board from '../../../shared/Board';
import GameTitle from '../../../shared/GameTitle';
import { menuButton, headerBtns } from '../../../shared/common';

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
  //  const bounds = helper.getBoardBounds(helper.viewportDim());
  
  const board = h(Board, {
    variant: ctrl.data.game.variant.key,
    okeyground: ctrl.okeyground,
      //    bounds
  });
  
  return h.fragment({}, [
    board
  ]);
}
