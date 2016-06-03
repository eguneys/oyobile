import menu from '../menu';
import * as utils from '../../utils';
import helper from '../helper';
import m from 'mithril';
import ViewOnlyBoard from './ViewOnlyBoard';

export function menuButton() {
  return (
      <button key="main-menu" className="fa fa-navicon main_header_button menu_button" config={helper.ontouch(menu.toggle)}>
    </button>
  );
}

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

  const className = [
    'main_header_button',
    'game_menu_button'
  ].join(' ');

  return (
    <button key={key} className={className}>
    </button>
  );
}

export function headerBtns() {
  return (
    <div key="buttons" className="buttons">
      {gamesButton()}
    </div>
  );
}

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
