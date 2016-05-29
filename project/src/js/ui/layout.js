import settings from '../settings';

var background;

export default {

  board: function(header, content, overlay, side = '') {
    background = background || settings.general.theme.background();
    return (
        <div className={'view-container ' + background}>
          <main id="page" className={side}>
            <header className="main_header board">
              {header()}
            </header>
            <div className="content_round">{content()}</div>
          </main>
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
          </main>
        </div>
    );
  }
  
}
