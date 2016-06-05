import m from 'mithril';
import okeyground from 'okeyground-mobile';
import * as utils from '../../../utils';
import layout from '../../layout';
import helper from '../../helper';
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
    board
  ];
}
