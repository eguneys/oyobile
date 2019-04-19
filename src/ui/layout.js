import menu from './menu';
import menuView from './menu/menuView';
import gamesMenu from './gamesMenu';
import newGameForm from './newGameForm';
import loginModal from './loginModal'
import signupModal from './signupModal'
import helper from './helper';
import settings from '../settings';

var background;

export default {

  onBackgroundChange: function(bg) {
    background = bg;
  },

  board: function(header, content, overlay, side = '') {
    background = background || settings.general.theme.background();
    return (
        <div className={'view-container ' + background}>
          <main id="page" className={side}>
            {/* <header className="main_header board">
            {header()}
            </header> */}
            <div className="content_round">{content()}</div>
            {menu.isOpen ? <div className="menu-close-overlay" config={helper.ontouch(menu.close)} /> : null }
          </main>
          {menuView()}
          {gamesMenu.view()}
          {loginModal.view()}
          {signupModal.view()}
          { overlay ? overlay() : null }
        </div>
    );
  },

  free: function(header, content, footer, overlay) {
    background = background || settings.general.theme.background();

    return (
        <div className={'view-container ' + background}>
          <main id="page">
            <header className="main_header">
              {header()}
            </header>
            <div className={'content' + (footer ? ' withFooter': '')}>
              {content()}
            </div>
            { footer ? <footer className="main_footer">{footer()}</footer> : null }
            {menu.isOpen ? <div className="menu-close-overlay" config={helper.ontouch(menu.close)} /> : null }
          </main>
          {menuView()}
          {gamesMenu.view()}
          {loginModal.view()}
          {signupModal.view()}
          {newGameForm.view()}
          { overlay ? overlay() : null }
        </div>
    );
  }
}