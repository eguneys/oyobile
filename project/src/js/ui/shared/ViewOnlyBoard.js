import okeyground from 'okeyground';

export default {
  view(_, args) {
    const boardClass = [
      'display_board'
    ].join(' ');

    function boardConf(el, isUpdate, context) {
      const config = makeConfig(args);
      if (context.ground) {
        context.ground.set(config);
      } else {
        // TODO try to avoid that
        if (!config.bounds) {
          console.log('no board bounds');
          config.bounds = el.getBoundingClientRect();
        }
        context.ground = okeyground(el, config);
      }
    }
    return (
        <div className={boardClass} config={boardConf}/>
    );
  }
};

function makeConfig(args) {
  const conf = {
  };
  
  return conf;
}
