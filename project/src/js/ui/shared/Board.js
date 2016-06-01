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

export default function(
  data,
  okeygroundCtrl,
  bounds,
  isPortrait,
  wrapperClasses) {

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
      renderPlayer('bottom'),
      renderPlayer('top'),
      renderPlayer('left'),
      renderPlayer('right')
    ];


    return (
      <section className={wrapperClass} config={wrapperConfig}
               style={wrapperStyle} key={key}>
        <div className={boardClass} config={boardConfig} />
      </section>
    );
    
}
