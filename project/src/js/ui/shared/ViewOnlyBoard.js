import okeyground from 'okeyground-mobile';

export default {
  view(_, args) {
    const boardClass = [
      'display_board',
      args.variant ? args.variant.key : ''
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
  const { fen, orientation, bounds } = args;
  const conf = {
    viewOnly: true,
    minimalDom: true,
    fen
  };

  if (bounds) conf.bounds = bounds;

  return conf;
}
