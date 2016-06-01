import layout from '../layout';
import { header as renderHeader } from '../shared/common';
import Board from '../shared/Board';
import helper from '../helper';
import { getBoardBounds } from '../../utils';
import m from 'mithril';

export default function view(ctrl) {
  var content, header;

  header = renderHeader.bind(null, 'playonboard');
  content = renderContent.bind(undefined, ctrl);

  function overlay() {
    return [];
  }

  return layout.board(
    header,
    content,
    overlay,
    ctrl.data
  );
}

function renderContent(ctrl) {
  const wrapperClasses = helper.classSet({
  });
  const isPortrait = helper.isPortrait();
  const bounds = getBoardBounds(helper.viewportDim(), isPortrait, helper.isIpadLike(), 'game');
  const board = Board(
    ctrl.data,
    ctrl.okeyground,
    bounds,
    isPortrait,
    wrapperClasses
  );

  return [
    board
  ];
}
