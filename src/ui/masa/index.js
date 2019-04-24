import i18n from '../../i18n';
import session from '../../session';
import { safeStringToNum } from '../../utils';
import * as helper from '../helper';
import { header } from '../shared/common';
import layout from '../layout';

import MasasListCtrl from './MasasListCtrl';
import { renderMasasList, renderFooter } from './masasListView';

export default {

  oncreate: helper.viewFadeIn,

  oninit({ attrs }) {
    // socket.createDefault()

    this.ctrl = new MasasListCtrl(safeStringToNum(attrs.tab));
  },

  view() {
    const ctrl = this.ctrl;
    
    const body = renderMasasList(ctrl);
    const footer = renderFooter(ctrl);
    const overlay = null;
    
    return layout.free(header(i18n('masas')), body, footer, overlay);
  }

};
