import i18n from '../../i18n';
import menu from '.';
import newGameForm from '../newGameForm';
import { hasNetwork } from '../../utils';
import helper from '../helper';
import Zanimo from 'zanimo';


function slidesInUp(el, isUpdate, context) {
  if (!isUpdate) {
    el.style.transform = 'translate3d(-100%, 0, 0)';
    // force reflow back
    context.lol = el.offsetHeight;
    Zanimo(el, 'transform', 'translate3d(0,0,0)', 250, 'ease-out');
  }
}


function renderHeader(user) {
  return (
    <header className="side_menu_header">
    { <div className="logo">oyunkeyf</div> }
    <h2 className="username">
      { hasNetwork() ? user ? user.username : i18n('anonymous') : i18n('offline') }
    </h2>
    { hasNetwork() && !user ?
      <button className="login">
      {i18n('signIn')}
      </button> : null
    }
    </header>
  );
}

function renderLinks(user) {

  return (
    <ul className="side_links">
      <li className="side_link" key="home" config={helper.ontouchY(menu.route('/'))}>
        <span className="fa fa-home" />{i18n('home')}
    </li>
    {hasNetwork() ? <li className="sep_link" key="sep_link_online">{i18n('playOnline')}</li> : null }
    {hasNetwork() ? <li className="side_link" key="play_real_time" config={helper.ontouchY(menu.popup(newGameForm.openRealtime))}>
      <span className="fa fa-plus-circle"/>{i18n('createAGame')}
    </li> : null }
    {hasNetwork() ? <li className="side_link" key="masas" config={helper.ontouchY(menu.route('/masa'))}>
      <span className="fa fa-trophy"/>{i18n('masas')}
    </li> : null }
    {hasNetwork() ? <li className="sep_link" key="sep_link_community">
      {i18n('community')}
    </li> : null }
    {hasNetwork() ? <li className="side_link" key="players">
      <span className="fa fa-at"/>{i18n('players')}
    </li> : null }
    {hasNetwork() ? <li className="side_link" key="ranking">
      <span className="fa fa-cubes"/>{i18n('leaderboard')}
    </li> : null }
    <li className="hr" key="set_link_settings"></li>
    <li className="side_link" key="settings">
      <span className="fa fa-cog"/>{i18n('settings')}
    </li>
    </ul>
  );
}

function renderMenu() {
  const user = null;
  return (
    <div className="native_scroller">
      {renderHeader(user)}
      { renderLinks(user) }
    </div>
  );
}

export default function view() {
  if (!menu.isOpen) return null;

  return (
    <aside id="side_menu" config={slidesInUp}>
      {renderMenu()}
    </aside>
  );
}

