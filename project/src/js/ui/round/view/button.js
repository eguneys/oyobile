import i18n from '../../../i18n';
import helper from '../../helper';
import Zanimo from 'zanimo';

function makeActionBarButton(key, icon, name, action) {
  return function(ctrl, config) {
    const className = helper.classSet({
      'action_bar_vbutton': true
    });

    if (!ctrl.vm[action]) return null;

    return (
        <button id={name} className={className} key={key} data-icon={icon} config={both(slidesInUp, helper.ontouch(gameActionHandler(ctrl, action)))}>
        {i18n(name)}
      </button>
    );
  };
}

export default {
  openSeries: makeActionBarButton('openSeries', 'L', 'openSeries', 'openSeries'),
  openPairs: makeActionBarButton('openPairs', 'L', 'openPairs', 'openPairs'),
  leaveTaken: makeActionBarButton('leaveTaken', 'L', 'leaveTaken', 'leaveTaken'),
  collectOpen: makeActionBarButton('collectOpen', 'L', 'collectOpen', 'collectOpen')
};

function gameActionHandler(ctrl, action) {
  return function() {
    if (ctrl[action]) ctrl[action].call();
  };
}

function slidesInUp(el, isUpdate, context) {
  if (!isUpdate) {
    el.style.transform = 'translate3d(100%, 0, 0)';
    // force reflow hack
    context.lol = el.offsetHeight;
    Zanimo(el, 'transform', 'translate3d(0,0,0)', 250, 'ease-out');
  }
}

function both(config1, config2) {
  return function() {
    config1.apply(null, arguments);
    config2.apply(null, arguments);
  };
}
