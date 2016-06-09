import i18n from '../../../i18n';
import helper from '../../helper';

function makeActionBarButton(key, icon, name) {
  return function(ctrl) {
    const className = helper.classSet({
      'action_bar_button': true
    });

    return (
      <button className={className} key={key} data-icon={icon}>
        {i18n(name)}
      </button>
    );
  }
}

export default {

  openSeries: function(ctrl) {
    const className = helper.classSet({
      'action_bar_button': true
    });

    return (
        <button className={className} key="openseries" data-icon="L">
          {i18n('openSeries')}
        </button>
    );
  },
  openPairs: function(ctrl) {
    const className = helper.classSet({
      'action_bar_button': true
    });

    return (
        <button className={className} key="openpairs" data-icon="L">
          {i18n('openPairs')}
        </button>
    );
  },
  leaveTaken: makeActionBarButton('leaveTaken', 'L', 'leaveTaken'),
  collectOpen: makeActionBarButton('collectOpen', 'L', 'collectOpen')
}
