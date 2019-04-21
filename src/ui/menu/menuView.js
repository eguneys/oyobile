import i18n from '../../i18n';
import session from '../../session';
import loginModal from '../loginModal';
import newGameForm from '../newGameForm';
import { hasNetwork, noop } from '../../utils';
import * as helper from '../helper';
import Zanimo from 'zanimo';
import * as menu from '.';

export default {
  onbeforeupdate() {
    return menu.mainMenuCtrl.isOpen;
  },

  view() {
    const user = session.get();
    
    return (
      <aside id="side_menu">
        {renderHeader()}
        <div className="native_scroller side_menu_scroller">
          {user && menu.profileMenuOpen() ? renderProfileActions(user) : renderLinks(user)}
        </div>
      </aside>

    );
  }
};

function renderHeader(user) {
  const profileLink = user ? menu.route('/@/' + user.id) : noop;

  return (
    <header className="side_menu_header">
      <button className="signInButton">
        {i18n('signIn')}
      </button>
    </header>
  );
}


function slidesInUp(el, isUpdate, context) {
  if (!isUpdate) {
    el.style.transform = 'translate3d(-100%, 0, 0)';
    // force reflow back
    context.lol = el.offsetHeight;
    Zanimo(el, 'transform', 'translate3d(0,0,0)', 250, 'ease-out');
  }
}

function renderProfileActionsOLD(user) {
  return (
    <ul className="side_links profileActions">
      <li className="side_link" config={helper.ontapXY(menu.route('/@/' + user.id))}>
        <span className="fa fa-user"/>{i18n('profile')}
    </li>
      <li className="side_link" config={helper.ontapXY(menu.route('/settings/preferences'))}>
        <span data-icon="%" />{i18n('preferences')}
      </li>
      <li className="side_link" config={helper.ontapXY(() => {
        session.logout();
        menu.profileMenuOpen(false);
      })}>
        <span data-icon="w" />
        {i18n('logOut')}
      </li>
    </ul>
  );
}

function renderLinks(user) {

  return (
    <ul className="side_links">
      <li className="side_link" key="home" config={helper.ontapXY(menu.route('/'))}>
        <span className="fa fa-home" />{i18n('home')}
      </li>
      {hasNetwork() ? 
        <li className="sep_link" key="sep_link_online">{i18n('playOnline')}</li> : null 
      }
      {hasNetwork() ?
        <li className="side_link" data-popup="createAGame">
         <span className="fa fa-plus-circle"/>{i18n('createAGame')}
        </li> : null }
      {hasNetwork() ? <li className="side_link" data-route="/masas">
         <span className="fa fa-trophy"/>{i18n('masas')}
       </li> : null }
      {hasNetwork() ? <li className="side_link" data-route="/players">
         <span className="fa fa-at"/>{i18n('players')}
       </li> : null }
      {hasNetwork() ? <li className="side_link" data-route="/ranking">
        <span className="fa fa-cubes"/>{i18n('leaderboard')}
       </li> : null }
       <li className="hr"></li>
       <li className="side_link" data-route="/settings">
         <span className="fa fa-cog"/>{i18n('settings')}
      </li>
    </ul>
  );
}


// OLD

function renderProfileActionsOLD(user) {
  return (
    <ul className="side_links profileActions">
      <li className="side_link" config={helper.ontouch(menu.route('/@/' + user.id))}>
        <span data-icon="r" />
        {i18n('profile')}
      </li>
      <li className="side_link" config={helper.ontouch(menu.route('/settings/preferences'))}>
        <span data-icon="%" />
        {i18n('preferences')}
      </li>
      <li className="side_link" config={helper.ontouch(() => {
        session.logout();
        menu.headerOpen(false);
      })}>
        <span data-icon="w" />
        {i18n('logOut')}
      </li>
    </ul>
  );
}

function renderLinksOLD(user) {

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
    {hasNetwork() ? <li className="side_link" key="players" config={helper.ontouchY(menu.route('/players'))}>
      <span className="fa fa-at"/>{i18n('players')}
    </li> : null }
    {hasNetwork() ? <li className="side_link" key="ranking">
      <span className="fa fa-cubes"/>{i18n('leaderboard')}
    </li> : null }
    <li className="hr" key="set_link_settings"></li>
    <li className="side_link" key="settings" config={helper.ontouchY(menu.route('/settings'))}>
      <span className="fa fa-cog"/>{i18n('settings')}
    </li>
    </ul>
  );
}

function renderMenu() {
  const user = session.get();
  return (
    <div className="native_scroller">
      {renderHeader(user)}
      { user && menu.headerOpen() ? renderProfileActions(user) : renderLinks(user) }
    </div>
  );
}
