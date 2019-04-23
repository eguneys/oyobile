import h from 'mithril/hyperscript';
import router from '../../../router';
import session from '../../../session';
import i18n from '../../../i18n';
import * as helper from '../../helper';
import settings from '../../../settings';

import faq from '../faq';

export function renderFAQOverlay(ctrl) {
  return [
    faq.view(ctrl.faqCtrl)
  ];
}

export function masaBody(ctrl) {
  const data = ctrl.masa;
  if (!data) return null;

  return h('div.masaContainer.native_scroller.page', [
    masaHeader(data, ctrl),
    data.podium ? masaPodium(data.podium): null,
    masaLeaderboard(ctrl)
  ]);
}

export function renderFooter(ctrl) {
  const m = ctrl.masa;
  if (!m) return null;
  const mUrl = 'https://oyunkeyf.net/masa/' + m.id;

  return (
    <div className="actions_bar">
      <button key="faq" className="action_bar_button" oncreate={helper.ontap(ctrl.faqCtrl.open)}>
        <span className="fa fa-question-circle"/>
          SSS
      </button>
      {ctrl.hasJoined ? withdrawButton(ctrl, m) : joinButton(ctrl, m) }
    </div>
  );
}

export function timeInfo(key, rounds, preceedingText) {
  if (rounds === undefined) return null;

  return [
    preceedingText ? (preceedingText + ' ') : null,
    // h(
  ];
}

function masaHeader(data, ctrl) {
  return (
    <div key="header" className="masaHeader">
      {masaTimeInfo(data)}
    {masaCreatorInfo(data, ctrl.startsAt)}
    </div>
  );
}

function masaTimeInfo(data) {
  const variant = data.variant;
  const control = data.scores;
  return (
    <div className="masaTimeInfo">
      <strong className="masaInfo withIcon">
        { variant + ' • ' + control }
      </strong>
    </div>
  );
}

function masaCreatorInfo(data, startsAt) {
  return (
    <div className="masaCreatorInfo">
      {i18n('by', data.createdBy)}
      &nbsp;•&nbsp;{startsAt}
    </div>
  );
}

function joinButton(ctrl, m) {
  if (!session.isConnected() || m.isFinished) { return null; }
  const action = () => ctrl.join();
  return (
      <button key="join" className="action_bar_button" oncreate={helper.ontap(action)}>
        <span className="fa fa-play"/>
        {i18n('join')}
      </button>
  );  
}

function withdrawButton(ctrl, m) {
  if (m.isFinished) { return null; }
  return (
    <button key="withdraw" className="action_bar_button" oncreate={helper.ontap(ctrl.withdraw)}>
      <span className="fa fa-flag"/>
      {i18n('withdraw')}
    </button>
  );
}

function masaLeaderboard(ctrl) {

  const data = ctrl.masa;
  const players = ctrl.currentPageResults;
  const user = session.get();
  const userName = user ? user.username : '';
  
  return (
    <div key="leaderboard" className="masaLeaderboard">
      { data.nbPlayers > 0 ?
        <p className="masaTitle"> {i18n("leaderboard")} ({i18n('nbConnectedPlayers', data.nbPlayers)})</p> : null }
      <ul className={'masaStandings'}>
      {players.map(p => renderPlayerEntry(ctrl, userName, p))}
      </ul>
    </div>
  );
}

function renderPlayerEntry(ctrl, userName, player) {
  const isMe = player.name === userName;

  return (
    (!player.active) ? (
      <li key={player.id} className={'list-item masa-list-player'}>
       <div className="masaPlayer">
         <span className="flagRank" data-icon={player.withdraw ? 'b':''}> {player.withdraw ? '' : (player.rank + '. ')}</span>
         <span> {i18n('emptySeat')}</span>
         <button oncreate={helper.ontap(ctrl.invite)}>{i18n('inviteBot')}</button>
       </div>
       <span className={'masaPoints '} data-icon='Q'>{player.score}</span>
      </li>
    ) :
    <li className={'list-item masa-list-player ' + (isMe ? 'masa-me' : '')} >
       <div className="masaPlayer">
         <span className="flagRank" data-icon={player.withdraw ? 'b':''}> {player.withdraw ? '' : (player.rank + '. ')}</span>
         <span> {!(player.name) ? 'Anonymous' : player.name + ' (' + player.rating + ') '}</span>
       </div>
       <span className={'masaPoints '} data-icon='Q'>{player.score}</span>
    </li>
  );

}
