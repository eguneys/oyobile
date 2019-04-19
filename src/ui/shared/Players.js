export function renderPlayer(position) {
  const playerClass = [
    'player',
    position
  ].join(' ');

  return (
    <div className={playerClass}>
    </div>
  );
}

export default function(
  data,
  bounds) {

    const playerClass = [
      'display_player'
    ].join(' ');

    const key = 'players';

    const topPlayer = renderPlayer('top')
    const leftPlayer = renderPlayer('left')
    const rightPlayer = renderPlayer('right')
    const bottomPlayer = renderPlayer('bottom')

    return (
      <div className={playerClass}>
        {topPlayer}
        {leftPlayer}
        {rightPlayer}
        {bottomPlayer}
      </div>
    );
}
