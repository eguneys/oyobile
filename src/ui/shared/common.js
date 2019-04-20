import * as menu from '../menu';
import * as utils from '../../utils';
import gamesMenu from '../gamesMenu';
import newGameForm from '../newGameForm';
import session from '../../session';
import * as helper from '../helper';
import m from 'mithril';
import ViewOnlyBoard from './ViewOnlyBoard';

export function menuButton() {
  return h('button.fa.fa-navicon.main_header_button.menu_button', {
    key: 'main-menu',
    oncreate: helper.ontap(menu.mainMenuCtrl.toggle)
  });
}


export function headerBtns() {

  if (utils.hasNetwork() && session.isConnected()) {
    return (
      <div key="buttons" className="buttons">
      </div>
    );
  } else {
    return (
      <div key="buttons" className="buttons">
      </div>
    );
  }
  
}

export function dropShadowHeader(title, leftButton) {

  return [
    h('nav', [
      leftButton ? leftButton : menuButton(),
      title ? <div className="main_header_title" key="title">{title}</div>: null,
      headerBtns()
    ]),
    h('div.main_header_drop_shadow')
  ];
  
}

// export function menuButton() {
//   return (
//       <button key="main-menu" className="fa fa-navicon main_header_button menu_button" config={helper.ontouch(menu.toggle)}>
//     </button>
//   );
// }

export function backButton(title) {
  return (
      <button key="default-history-backbutton" className="back_button main_header_button" config={helper.ontouch(utils.backHistory)}>
      <span className="fa fa-arrow-left"/>
      {title ? <div className="title">{title}</div> : null }
    </button>
  );
}

export function gamesButton() {
  let key, action;

  key='games-menu';

  if (session.nowPlaying().length) {
    key = 'games-menu';
    action = gamesMenu.open;
  } else {
    key = 'new-game-form';
    action = newGameForm.open;
  }

  const className = [
    'main_header_button',
    'game_menu_button',
    !utils.hasNetwork() ? 'invisible' : ''
  ].join(' ');

  const longAction = () => window.plugins.toast.show(i18n('nbGamesInPlay', session.nowPlaying().length), 'short', 'top');

  return (
      <button key={key} className={className} config={helper.ontouch(action, longAction)}>
    </button>
  );
}

// export function headerBtns() {
//   return (
//     <div key="buttons" className="buttons">
//       {gamesButton()}
//     </div>
//   );
// }

export function header(title, leftButton) {
  return (
    <nav>
      {leftButton ? leftButton : menuButton()}
      {title ? <h1 key="title">{title}</h1> : null }
      {headerBtns()}
    </nav>
  );
}

export function viewOnlyBoardContent() {
  const isPortrait = false;
  const { vw, vh } = { vw: 10, vh: 10 }
  const boardStyle = isPortrait ? { width: vw + 'px', height: vw + 'px' } : {};
  const boardKey = 'viewonlyboard'
  const className = 'board_wrapper'
  const board = (
    <section key={boardKey} className={className} style={boardStyle}>
      {m.component(ViewOnlyBoard)}
    </section>
  );
  return [
    board
  ];
}

export function empty() {
  return [];
}

export function userStatus(user) {
  const status = user.online ? 'online' : 'offline';
  return (
    <div className="user">
      <span className={'userStatus ' + status} data-icon="r" />
      {user.username}
    </div>
  );
}
