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
  openSeries(ctrl) {
    const className = "open-series";
    return (
        <button className={className} key="openSeries"
      oncreate={helper.ontap(ctrl.openSeries)}>{i18n('openSeries')}</button>
    );
  },
  openPairs(ctrl) {
    const className = "open-pairs";
    return (
        <button className={className} key="openPairs"
      oncreate={helper.ontap(ctrl.openPairs)}>{i18n('openPairs')}</button>
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
  },
  collectOpen(ctrl) {
    const className = "collect-open";
    return (
        <button className={className} key="collectOpen"
      oncreate={helper.ontap(ctrl.collectOpen)}>{i18n('collectOpen')}</button>
    );    
  },
  leaveTaken(ctrl) {
    const className = "leave-taken";
    return (
        <button className={className} key="leaveTaken"
      oncreate={helper.ontap(ctrl.leaveTaken)}>{i18n('leaveTaken')}</button>
    );    
  }
};
