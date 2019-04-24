import redraw from '../../utils/redraw';
import { handleXhrError } from '../../utils';
import * as xhr from './masaXhr';

export default function MasasListCtrl(defaultTab) {
  this.currentTab = defaultTab || 0;


  this.refresh = () => {
    xhr.currentMasas()
      .then(data => {
        this.masas = data;
        redraw();
      }).catch(handleXhrError);
  };

  this.refresh();

  this.onTabChange = (tabIndex) => {
    const loc = window.location.search.replace(/\?tab\=\w+$/, '');

    try {
      window.history.replaceState(window.history.state, '', loc + '?tab=' + tabIndex);
    } catch (e) { console.error(e); }
    this.currentTab = tabIndex;
    redraw();
  };

}
