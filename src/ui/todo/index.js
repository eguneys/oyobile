import i18n from '../../i18n';
import * as helper from '../helper';
import layout from '../layout';
import { header } from '../shared/common';

export default {
  oncreate: helper.viewFadeIn,
  oninit({attrs}) {},
  view() {
    const body = <div>{i18n('underConstruction')}</div>;

    return layout.free(header(i18n('todo')), body, null, null);
  }  
}
