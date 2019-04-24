import i18n from '../../../../i18n';
import router from '../../../../router';
import * as helper from '../../../helper';

export default {
  resign(ctrl) {
    return h('button', {
      key: 'resign',
      className: 'resign',
      'data-icon': 'b',
      oncreate: helper.ontap(ctrl.resign)
    }, i18n('resign'));
  },
  returnToMasa(ctrl) {
    function handler() {
      ctrl.hideActions();
      const url = `/masa/${ctrl.data.game.masaId}`;
      router.set(url, true);
    }
    return(
        <button key="returnToMasa" oncreate={helper.ontap(handler)}>
          <span className="fa fa-throphy"/>
          {i18n('backToMasa')}
        </button>
    );
  },
  sortPairs(ctrl) {
    const className = "sort-series";    
    return (
        <button className={className} key="sortSeries"
      oncreate={helper.ontap(ctrl.sortPairs)}>{i18n('sortPairs')}</button>
    );
  },
  sortSeries(ctrl) {
    const className = "sort-pairs";
    return (
        <button className={className} key="sortSeries"
      oncreate={helper.ontap(ctrl.sortSeries)}>{i18n('sortSeries')}</button>
    );
  }
};
