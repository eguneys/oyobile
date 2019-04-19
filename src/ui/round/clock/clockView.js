import helper from '../../helper';

export function view(ctrl, side, runningSide, position) {
  const time = ctrl.data.sides[side];
  const isRunning = runningSide === side;
  const className = `clock clock_${side} clock_${position} ` +
                    helper.classSet({
                      outoftime: !time,
                      running: isRunning,
                      emerg: time < ctrl.data.emerg
                    });

  return (
    <div className={className}>
      {showBar(ctrl, time)}
    </div>
  );
}

function showBar(ctrl, time) {
  const barStyle = {
    width: Math.max(0, Math.min(100, (time / ctrl.data.barTime) * 100)) + '%'
  };
  return (<div className='bar'>
      <span style={barStyle}>
      </span>
  </div>);
}
