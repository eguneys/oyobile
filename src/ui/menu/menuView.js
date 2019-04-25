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
        {renderHeader(user)}
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
      { hasNetwork() && !user ?
        <button className="signInButton" oncreate={helper.ontapXY(loginModal.open)}>
          {i18n('signIn')}
        </button> : null
      }
      { user ?
        <h2 className="username" oncreate={helper.ontapXY(profileLink)}>
          {user.username}
        </h2> : null
      }
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

function renderLinks(user) {

  return (
    <ul className="side_links"
      oncreate={helper.ontapXY(onLinkTap, undefined, helper.getLI)}>
      <li className="side_link" data-route="/">
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
      {hasNetwork() ? <li className="side_link" data-route="/todo">
         <span className="fa fa-at"/>{i18n('players')}
       </li> : null }
      {hasNetwork() ? <li className="side_link" data-route="/todo">
        <span className="fa fa-cubes"/>{i18n('leaderboard')}
       </li> : null }
       <li className="hr"></li>
       <li className="side_link" data-route="/settings">
        <span className="fa fa-cog"/>{i18n('settings')}
       </li>
      <li className="side_link" oncreate={helper.ontapXY(() => {
         session.logout();
        // menu.mainMenuCtrl.close(false);
       })}>
         <span data-icon="w" />
         {i18n('logOut')}
       </li>
    </ul>
  );
}

function renderProfileActions(user) {
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

const popupActionMap = {
  'createAGame': () => newGameForm.openRealtime()
};

function onLinkTap(e) {
  const el = helper.getLI(e);
  const ds = el.dataset;
  if (el && ds.route) {
    menu.route(ds.route)();
  } else if (el && ds.popup) {
    menu.popup(popupActionMap[ds.popup])();
  }
}


// OLD

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

function renderMenu() {
  const user = session.get();
  return (
    <div className="native_scroller">
      {renderHeader(user)}
      { user && menu.headerOpen() ? renderProfileActions(user) : renderLinks(user) }
    </div>
  );
}
