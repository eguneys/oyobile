import * as utils from '../../utils';
import helper from '../helper';
import okeyground from 'okeyground-mobile';
import { menuButton } from './common';
import { renderPlayer } from './Players';

function renderTopMenu() {
  return (
    <div class="display_menu">
      {menuButton()}
    </div>
  );
}

function renderPlayerInfo(ctrl, player, position) {
  const playerName = utils.playerName(player);
  const wrapperClass = [
    'playerInfos',
    position
  ].join(' ');
  const togglePopup = ctrl.toggleUserPopup.bind(ctrl, position, player.user);
  const vConf = helper.ontouch(togglePopup)

  return (
    <div className={wrapperClass} config={vConf}>
      <h2 className="playerUser">
        {playerName}
        {player.onGame ?
         <span className="ongame yes" data-icon="3"/> :
         <span className="ongame no" data-icon="0"/>
        }
      </h2>
    </div>
  );
}

export default function(
  ctrl,
  okeygroundCtrl,
  bounds,
  isPortrait,
  wrapperClasses) {
    const data = ctrl.data;

    const boardClass = [
      'display_board',
    ].join(' ');

    const key = 'board' + (isPortrait ? 'portrait' : 'landscape');
    let wrapperClass = 'game_board_wrapper';

    if (wrapperClasses) {
      wrapperClass += ' ' + wrapperClasses;
    }

    const wrapperStyle = bounds ? {
      height: bounds.height + 'px',
      width: bounds.width + 'px'
    } : {};


    function wrapperConfig(el, isUpdate) {
      if (!isUpdate) {
      }
    }

    function boardConfig(el, isUpdate) {
      if (!isUpdate) {
        if (!bounds) {
        }
        okeyground.render(el, okeygroundCtrl);
      }
    }

    okeygroundCtrl.data.topHooks = [
      renderTopMenu(),
      renderPlayerInfo(ctrl, data.opponentUp, 'top'),
      renderPlayerInfo(ctrl, data.opponentLeft, 'left'),
      renderPlayerInfo(ctrl, data.player, 'bottom'),
      renderPlayerInfo(ctrl, data.opponentRight, 'right')
    ];


    return (
      <section className={wrapperClass} config={wrapperConfig}
               style={wrapperStyle} key={key}>
        <div className={boardClass} config={boardConfig} />
      </section>
    );
    
}
