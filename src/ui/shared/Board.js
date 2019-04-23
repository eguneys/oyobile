import settings from '../../settings';
import redraw from '../../utils/redraw';

export default {
  oninit(vnode) {
    
    const { okeyground } = vnode.attrs;

    this.wrapperOnCreate = (({dom}) => {
    });

    this.boardOnCreate = ({dom}) => {
      okeyground.attach(dom);
    };

    this.boardOnRemove = () => {
      okeyground.detach();
    };
    
  },

  view(vnode) {
    const { bounds } = vnode.attrs;

    const boardClass = [
      'display_board',
    ].join(' ');

    let wrapperClass = 'game_board_wrapper';

    const wrapperStyle = bounds ? {
      height: bounds.height + 'px',
      width: bounds.width + 'px'
    } : {};

    return (
        <section oncreate={this.wrapperOnCreate} className={wrapperClass} style={wrapperStyle}>
          <div className={boardClass}
             oncreate={this.boardOnCreate}
             onremove={this.boardOnRemove}/>
        </section>
    );
  }
  
};


// function renderTopMenu() {
//   return (
//     <div class="display_menu">
//       {menuButton()}
//     </div>
//   );
// }

// function renderPlayerInfo(ctrl, player, position) {
//   const wrapperClass = helper.classSet({
//     'playerInfos': true,
//   }) + ` ${position}`;

//   const playerName = player.ai ?
//                      i18n('aiBot', player.ai) :
//                      utils.playerName(player);
//   const playerOnGame = (player.onGame || player.ai ?
//                         <span className="ongame yes" data-icon="3"/> :
//                         <span className="ongame no" data-icon="0"/>
//   );

//   const togglePopup = ctrl.toggleUserPopup.bind(ctrl, position, player.user);
//   const vConf = helper.ontouch(togglePopup);

//   const runningSide = ctrl.isClockRunning() ? ctrl.data.game.player : null;
//   const running = ctrl.data.game.player === player.side;

//   const opens = ctrl.data.game.oscores ? ctrl.data.game.oscores[player.side] : null;
//   const opensHint = opens ? (opens.series ? 'openedSeries' : 'openedPairs') : null;
//   const opensClass = "opens" + ((opens && opens.new) ? " new" : "");

//   return (
//     <div className={wrapperClass} config={vConf}>
//       <div class="wrap_info">
//         {opens ?
//          <div class={opensClass}>
//            {(opens.series ? opens.series : opens.pairs)}
//            {' '}
//            {i18n(opensHint).split(' ')[0]}
//          </div>: null
//         }
//       </div>
//       <div class="wrap_user">
//         <h2 className="playerUser">
//           {playerName}
//           {playerOnGame}
//         </h2>
//         { (ctrl.clock && running) ?
//           renderClock(ctrl.clock, player.side, runningSide, position) : null
//         }
//       </div>
//     </div>
//   );
// }

// export default function(
//   ctrl,
//   okeygroundCtrl,
//   bounds,
//   isPortrait,
//   wrapperClasses) {
//     const data = ctrl.data;

//     const boardClass = [
//       'display_board',
//     ].join(' ');

//     const key = 'board' + (isPortrait ? 'portrait' : 'landscape');
//     let wrapperClass = 'game_board_wrapper';

//     if (wrapperClasses) {
//       wrapperClass += ' ' + wrapperClasses;
//     }

//     const wrapperStyle = bounds ? {
//       height: bounds.height + 'px',
//       width: bounds.width + 'px'
//     } : {};


//     function wrapperConfig(el, isUpdate) {
//       if (!isUpdate) {
//       }
//     }

//     function boardConfig(el, isUpdate) {
//       if (!isUpdate) {
//         if (!bounds) {
//         }
//         okeyground.render(el, okeygroundCtrl);
//       }
//     }

//     okeygroundCtrl.data.topHooks = [
//       // renderTopMenu(),
//       renderPlayerInfo(ctrl, data.opponentUp, 'top'),
//       renderPlayerInfo(ctrl, data.opponentLeft, 'left'),
//       renderPlayerInfo(ctrl, data.player, 'bottom'),
//       renderPlayerInfo(ctrl, data.opponentRight, 'right')
//     ];


//     return (
//       <section className={wrapperClass} config={wrapperConfig}
//                style={wrapperStyle} key={key}>
//         <div className={boardClass} config={boardConfig} />
//       </section>
//     );
// }
