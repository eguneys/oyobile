import popupWidget from './shared/popup';
import formWidgets from './shared/form';
import i18n from '../i18n';
import * as utils from '../utils';
import newGameForm from './newGameForm';
import helper from './helper';
import iScroll from 'iscroll';
import settings from '../settings';
import session from '../session';
import backbutton from '../backbutton';
import lobby from './lobby';
import m from 'mithril';
import ViewOnlyBoard from './shared/ViewOnlyBoard';

var scroller = null;

const gamesMenu = {};

gamesMenu.isOpen = false;

gamesMenu.open = function() {
  backbutton.stack.push(gamesMenu.close);
  gamesMenu.isOpen = true;
  setTimeout(function() {
    if (utils.hasNetwork() && scroller) scroller.goToPage(1, 0);
  }, 400);
  session.refresh();
};

gamesMenu.close = function(fromBB) {
  if (fromBB !== 'backbutton' && gamesMenu.isOpen) backbutton.stack.pop();
  gamesMenu.isOpen = false;
};

function joinGame(g) {
  gamesMenu.close();
  m.route('/game/' + g.fullId);
}

function cardDims() {
  const vp = helper.viewportDim();

  // if we're here it's a phone
  let width = 200;
  let height = width / (4/3);
  let margin = 10;
  return {
    w: width + margin * 2,
    h: height + 70,
    innerW: width,
    margin: margin
  };
}

function renderViewOnlyBoard(cDim, fen, orientation, variant) {
  const innerH = cDim ? cDim.innerW / (4/3): 0;
  const innerW = cDim ? cDim.innerW : 0;
  const style = cDim ? { height: innerH + 'px' } : {};
  const bounds = cDim ? { width: innerW, height: innerH } : null;
  return (
    <div className="boardWrapper" style={style}>
      {m.component(ViewOnlyBoard, { bounds, fen, orientation, variant})}
    </div>
  );
}

function timeLeft(g) {
  if (!g.isMyTurn) return i18n('waitingForOpponent');
  return i18n('yourTurn');
}

function renderGame(g, cDim, cardStyle) {
  const icon = utils.gameIcon(g.perf);
  const cardClass = [
    'card',
    'standard'
  ].join(' ');

  const timeClass = [
    'timeIndication',
    g.isMyTurn ? 'myTurn': 'opponentTurn'
  ].join(' ');
  const config = helper.ontouchX(() => joinGame(g));

  return (
    <div className={cardClass} key={'game.' + g.gameId} style={cardStyle}
    config={config}>
      {renderViewOnlyBoard(cDim, g.fen, g.side, g.variant)}
      <div className="infos">
        <div className="description">
          <p>
            <span className="variant">{g.variant.name}</span>
            <span className={timeClass}>{timeLeft(g)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function renderAllGames(cDim) {
  const nowPlaying = session.nowPlaying(); // .concat(session.nowPlaying());
  const cardStyle = cDim ? {
    width: (cDim.w - cDim.margin * 2) + 'px',
    height: cDim.h + 'px',
    marginLeft: cDim.margin + 'px',
    marginRight: cDim.margin + 'px'
  } : {};

  const nbCards = utils.hasNetwork() ?
                  nowPlaying.length + 1 :
                  0;

  let wrapperStyle, wrapperWidth;
  if (cDim) {
    // scroller wrapper width
    // calcul is:
    // ((cardWidth + visible part of adjacent card) * nb of cards) +
    // wrapper's marginLeft
    wrapperWidth = ((cDim.w + cDim.margin * 2) * nbCards) +
                   (cDim.margin * 2);
    wrapperStyle = {
      width: wrapperWidth + 'px',
      marginLeft: (cDim.margin * 3) + 'px'
    };
  }

  var allCards = nowPlaying.map(g => renderGame(g, cDim, cardStyle));

  if (!helper.isWideScreen()) {

    const newGameCard = (
      <div className="card standard" key="game.new-game" style={cardStyle}
           config={helper.ontouchX(() => { gamesMenu.close(); newGameForm.open(); })}>
        {renderViewOnlyBoard(cDim)}
        <div className="infos">
          <div className="description">
            <h2 className="title">{i18n('createAGame')}</h2>
            <p>{i18n('newOpponent')}</p>
          </div>
        </div>
      </div>
    );
    if (utils.hasNetwork()) allCards.unshift(newGameCard);
  }

  return m('div#all_games', { style: wrapperStyle }, allCards);
}


gamesMenu.view = function() {
  if (!gamesMenu.isOpen) return null;

  const vh = helper.viewportDim().vh
  const cDim = cardDims();
  const wrapperStyle = helper.isWideScreen() ? {} : { top: ((vh - cDim.h) / 2) + 'px' };
  const wrapperConfig =
  helper.isWideScreen() ? utils.noop :
  function(el, isUpdate, context) {
    if (!isUpdate) {
      scroller = new iScroll(el, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: '.card',
        snapSpeed: 400,
        preventDefaultException: {
          tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|LABEL)$/
        }
      });

      context.unonload = function() {
        if (scroller) {
          scroller.destroy();
          scroller = null;
        }
      };
    }
    // see https://github.com/cubiq/iscroll/issues/412
    scroller.options.snap = el.querySelectorAll('.card');
    scroller.refresh();
  };

  const isWideScreen = helper.isWideScreen();

  const wrapperClass = isWideScreen ? 'overlay_popup' : '';

  return (
    <div id="games_menu" className="overlay_popup_wrapper">
      <div className="wrapper_overlay_close"
           config={helper.ontouch(helper.fadesOut(gamesMenu.close, '.overlay_popup_wrapper'))}/>
      <div id="wrapper_games" className={wrapperClass} style={wrapperStyle} config={wrapperConfig}>
        { isWideScreen ? (
          <header>
            {i18n('nbGamesInPlay', session.nowPlaying().length)}
          </header>
        ) : null }
        { isWideScreen ? (
          <div className="popup_content">
          {renderAllGames(null)}
          </div>
        ) : renderAllGames(cDim) }
      </div>
    </div>
  );
};

export default gamesMenu;
