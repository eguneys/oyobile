import layout from '../layout';
import { header as renderHeader, viewOnlyBoardContent } from '../shared/common';
import m from 'mithril';

export default function view(ctrl) {
  var content, header;

  header = renderHeader.bind(null, 'playonboard');
  content = viewOnlyBoardContent.bind(null);

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

