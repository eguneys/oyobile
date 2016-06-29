import mapValues from 'lodash/mapValues';
import merge from 'lodash/merge';
import { header as headerWidget, backButton } from '../../shared/common';
import session from '../../../session';
import layout from '../../layout';
import i18n from '../../../i18n';
import faq from '../faq';
import helper from '../../helper';
import { gameIcon } from '../../../utils';
import m from 'mithril';

export default function view(ctrl) {
  const headerCtrl = headerWidget
        .bind(null, null,
              backButton(ctrl.masa() ? ctrl.masa().fullName : null));
  
  const body = masaBody.bind(null, ctrl);
  const footer = renderFooter.bind(null, ctrl);
  const faqOverlay = renderFAQOverlay.bind(null, ctrl);
  const overlay = () => [faqOverlay()];

  return layout.free(headerCtrl, body, footer, overlay);
};

function renderFAQOverlay(ctrl) {
  return [
    faq.view(ctrl.faqCtrl)
  ];
}

function masaBody(ctrl) {
  const data = ctrl.masa();
  if (!data) return null;

  let body;
  if (data.isFinished) {
    body = masaContentFinished(ctrl);
  } else if (!data.isStarted) {
    body = masaContentCreated(ctrl);
  } else {
    body = masaContentStarted(ctrl);
  }

  return (
    <div class="masaContainer native_scroller page withFooter">
      {body}
    </div>
  );
}

function masaContentFinished(ctrl) {
  const data = ctrl.masa();
  return [
    masaHeader(data, data.roundsToFinish, ''),
    data.podium ? masaPodium(data.podium.map(p =>
      merge(p, data.players[p.id])
    )) : null,
    masaLeaderboard(ctrl)
  ];
}

function currentGames(data) {
  var ids = {
    created: 10,
    started: 20,
    aborted: 25,
    middleEnd: 30,
    normalEnd: 40,
    variantEnd: 70
  };
  return data.pairings.filter(function(p) {
    return p.s < ids.aborted
  });
}

function myCurrentGameId(data) {
  var playerId = data.playerId;
  if (!playerId) return null;

  var pairing = currentGames(data).filter(p =>
    p.u.filter((id) =>
      id.toLowerCase() === playerId.toLowerCase())[0]
  )[0];

  return pairing ? pairing.id : null;
}

function masaContentStarted(ctrl) {
  const data = ctrl.masa();
  const gameId = myCurrentGameId(data);
  const playings = currentGames(data);
  const currentGameId = playings[0] ? playings[0].id : null;
  return [
    masaHeader(data, data.roundsToFinish, ''),
    gameId ? m('a.pov.button.glowed', {
      config: helper.ontouch(m.route.bind(null, `/masa/${data.id}/game/${gameId}`))
    }, [
      i18n('youArePlaying'),
      m('span.text[data-icon=G]', i18n('joinTheGame'))
    ]) : (currentGameId ? 
        m('a.pov.spectator.button', {
          config: helper.ontouch(m.route.bind(null, `/masa/${data.id}/game/${currentGameId}`))
        }, [
          i18n('nowPlaying'),
          m('span.text[data-icon=G]', i18n('spectateGame'))
        ]) : null),
    masaLeaderboard(ctrl)
  ];
}


function masaContentCreated(ctrl) {
  const data = ctrl.masa();
  return [
    masaHeader(data, data.roundsToFinish, ''),
    masaSeats(ctrl),
    masaLeaderboard(ctrl)
  ];
}

function masaHeader(data, rounds, roundsText) {
  const variant = variantDisplay(data);
  const control = i18n('rated');
  const handS = i18n('hands');
  const roundString = data.rounds ? `${data.nbRounds}/${data.rounds}${handS}` : `${data.scores}P`;
  
  return (
    <div key="header" className="masaHeader">
      <div className="masaInfoRounds">
        <strong className="masaInfo" data-icon={gameIcon(variantKey(data))}>
          {variant + ' • ' + control + ' • ' + roundString }
        </strong>
      </div>
      <div className="masaCreatorInfo">
        { i18n('by', formatCreatedBy(data)) }
        &nbsp;•&nbsp;
        {window.moment(data.createdAt).calendar() }
      </div>
    </div>
  );
}

function masaSeats(ctrl) {
  const data = ctrl.masa();
  const players = data.players;
  const actives = mapValues(data.actives, (p) => players[p.id]);
  const me = data.me ? data.me.side : '';
  return (
    <div key="seats" className="masaSeats">
      {masaSeat(ctrl, 'north', actives.north, me)}
      <div className="middle">
        {masaSeat(ctrl, 'west', actives.west, me)}
        <div className="table"/>
        {masaSeat(ctrl, 'east', actives.east, me)}
      </div>
      {masaSeat(ctrl, 'south', actives.south, me)}
    </div>
  );
}

function getPlayerName(p) {
  return p.ai ? i18n('aiBot', p.ai) :
         p.name ? p.name : i18n('anonymous');
}

function masaSeat(ctrl, side, p, me) {
  const playerName = p ? getPlayerName(p): '';
  const classes = ' in' + (p ? '' : ' empty') + ((me === side[0]) ? ' me' : '');
  return (
    <div className={"masaSeat" + classes }>
      {playerName ? <span className="title">{playerName}</span>: joinButton(ctrl, '', side)}
    </div>
  );
}

function masaLeaderboard(ctrl) {
  const data = ctrl.masa();
  const players = data.standing.players.map(p =>
    merge(p, data.players[p.id])
  );
  const user = session.get();
  const userName = user ? user.username : '';

  return (
    <div key="leaderboard" className="masaLeaderboard">
      <p className="masaTitle"> {i18n('leaderboard')} ({i18n('nbPlayers', data.nbPlayers)})</p>
      <table className="masaStandings">
        {players.map(renderLeaderboardItem.bind(null, ctrl.playerInfoCtrl, userName, data.playerId))}
      </table>
    </div>
  );
}

function masaPairings(ctrl) {
  return (
    <div key="pairings" className="masaPairings">
      <p className="masaTitle"> {i18n('rounds')}</p>
      <table className="masaPairings">
      </table>
    </div>
  );
}

function renderLeaderboardItem(playerInfoCtrl, userName, playerId, player) {
  const isMe = player.id === playerId;
  const playerName = player.name || getPlayerName(player);
  const playerRating = player.rating ? (' (' + player.rating + ') ') : '';
  const playerWithRating = playerName + playerRating;

  return (
    <tr key={player.name} className={'list_item' + (isMe ? ' me' : '')} config={helper.ontouchY(playerInfoCtrl.open.bind(null, player))}>
      <td className='masaPlayer'>
        <span className='flagRank' data-icon={player.active ? '': 'b'}>
          {player.active ? (player.rank + '. ') : ''}
        </span>
        <span> { playerWithRating } </span>
      </td>
      <td className='masaPoints'>
        <span data-icon='Q'>{player.score}</span>
      </td>
    </tr>
  );
}

function masaPodium(podium) {
  return (
    <div key="podium" className="podium">
      { renderPlace(podium[0]) }
    </div>
  );
}

function renderPlace(data) {
  if (!data) return null;

  const rank = data.rank;
  return (
    <div className={'place' + rank}>
      <div className="trophy"></div>
    <div className="username" config={data.name ? helper.ontouch(() => m.route('/@/' + data.name)) : null}>
        {getPlayerName(data)}
      </div>
      {data.rating ?
       <div className="rating"> {data.rating} {renderProgress(data.ratingDiff)} </div>
       : null
      }
       <table className="stats">
       </table>
    </div>
  );
}

function renderProgress(p) {
  if (p === 0) return null;
  return m('span', {
    className: 'progress ' + (p > 0 ? 'positive' : 'negative'),
    'data-icon': p > 0 ? 'N' : 'M'
  }, Math.abs(p));
}

function renderFooter(ctrl) {
  if (!ctrl.masa()) {
    return null;
  }

  return (
    <div className="actions_bar">
      <button key="faq" className="action_bar_button" config={helper.ontouch(ctrl.faqCtrl.open)}>
        <span className="fa fa-question-circle"/>
        {i18n('faq')}
      </button>
      { ctrl.hasJoined() ? withdrawButton(ctrl): joinButton(ctrl, "action_bar_button") }
    </div>
  );
}

function joinButton(ctrl, klass, side) {
  //if (!session.isConnected() || ctrl.masa().isFinished) {
  if (ctrl.masa().isFinished) {
    return null;
  }

  klass = klass || "";

  return (
    <button key="join" className={klass} config={helper.ontouch(() => ctrl.join(ctrl.masa().id, side))}>
      <span className="fa fa-play"/>
      {i18n('join')}
    </button>
  );
}

function withdrawButton(ctrl) {
  // if (!session.isConnected() || ctrl.masa().isFinished) {
  if (ctrl.masa().isFinished) {
    return null;
  }

  return (
    <button key="withdraw" className="action_bar_button" config={helper.ontouch(() => ctrl.withdraw(ctrl.masa().id))}>
      <span className="fa fa-flag"/>
      {i18n('withdraw')}
    </button>
  );
}

function variantDisplay(data) {
  let variant = variantKey(data);
  // variant = variant.split(' ')[0]; // Cut off names to first word

  // if (variant.length > 0) {
  //   variant = variant.charAt(0).toUpperCase() + variant.substring(1);
  // }

  return i18n(variant);
}

function variantKey(data) {
  let variant = data.variant;
  return variant;
}

function formatCreatedBy(data) {
  const player = data.players[data.createdBy];

  return player ? (player.name ? player.name : i18n('anonymous')) : data.createdBy;
}
