import * as utils from'../../utils';
import h from '../helper'
import layout from '../layout';
import { menuButton, userStatus } from '../shared/common';
import i18n from '../../i18n';
import m from 'mithril'

export default function view(ctrl) {

  const headerCtrl = header.bind(null, ctrl);
  const bodyCtrl = body.bind(null, ctrl);

  return layout.free(headerCtrl, bodyCtrl, null);
}

function header(ctrl) {
  return (
    <nav>
      {menuButton()}
      <h1>{i18n('players')}</h1>
      <div className="buttons">
        <button className="main_header_button" key="searchPlayers" data-icon="y"/>
      </div>
    </nav>
  );
}

function body(ctrl) {
  return (
    <ul className="playersSuggestion native_scroller_page">
      {ctrl.players().map(renderPlayer)}
    </ul>
  );
}

function renderPlayer(user) {
  // find best perf
  const perf = Object.keys(user.perfs).reduce((prev, curr) => {
    if (!prev) return curr;
    if (user.perfs[prev].rating < user.perfs[curr].rating)
      return curr;
    else
      return prev;
  });

  return (
    <li className="list_item playerSuggestion nav" config={h.ontouchY(() => m.route('/@/' + user.id))}>
      {userStatus(user)}
      <span className="rating" data-icon={utils.gameIcon(perf)}>
        {user.perfs[perf].rating}
      </span>
    </li>
  );
}
