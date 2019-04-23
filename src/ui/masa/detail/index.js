import h from 'mithril/hyperscript';
import socket from '../../../socket';
import i18n from '../../../i18n';
import { dropShadowHeader as headerWidget, backButton, connectingDropShadowHeader } from '../../shared/common';
import * as helper from '../../helper';
import layout from '../../layout';
import { masaBody, renderFAQOverlay, renderFooter, timeInfo } from './masaView';

import MasaCtrl from './MasaCtrl';

export default {
  oninit({attrs}) {
    this.ctrl = new MasaCtrl(attrs.id);
  },
  oncreate: helper.viewSlideIn,
  onremove() {
    socket.destroy();
    this.ctrl.unload();
  },
  view() {
    if (this.ctrl.notFound) {
      return layout.free(
        headerWidget(null, backButton(i18n('masaNotFound'))),
        h('div.masaNotFound', { key: 'masa-not-found' }, [
          h('p', i18n('masaDoesNotExist')),
          h('p', i18n('masaMayHaveBeenCanceled'))
        ])
      );
    }

    const masa = this.ctrl.masa;
    let header;

    if (masa) {
      header = headerWidget(null,
                            backButton(h('div.main_header_title.withSub', [
                              h('h1', [
                                h('span.fa.fa-trophy'),
                                this.ctrl.masa.fullName
                              ]),
                              h('h2.header-subTitle.masa-subTitle',
                                !masa.isFinished && !masa.isStarted ?
                                timeInfo('created', masa.playersToStart, 'Oyuncu bekleniyor') :
                                timeInfo('started', masa.roundsToFinish, '')
                               )
                            ]))
                           );
    } else {
      header = connectingDropShadowHeader();
    }

    const body = masaBody(this.ctrl);
    const footer = renderFooter(this.ctrl);
    const faqOverlay = renderFAQOverlay(this.ctrl);
    const overlay = [
      faqOverlay
    ];

    return layout.free(header, body, footer, overlay);
  }
};
