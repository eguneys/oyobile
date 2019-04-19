import * as utils from '../../utils';
import helper from '../helper';
import { header as headerWidget, backButton } from '../shared/common';
import layout from '../layout';
import formWidgets from '../shared/form';
import settings from '../../settings';
import i18n from '../../i18n';
import socket from '../../socket';
import m from 'mithril';

export default {

  controller() {
    socket.createDefault();
  },

  view() {
    const header = utils.partialf(headerWidget, null, backButton(i18n('settings')));

    return layout.free(header, renderBody);
  }

};

function renderBody() {
  return m('div', {
    style: { width: '100%', height: '100%' }
  }, [
    m('ul.settings_list.general.native_scroller.page', [
      m('li.list_item.nav', {
        key: 'lang',
        config: helper.ontouchY(utils.f(m.route, '/settings/lang'))
      }, i18n('language')),
      m('li.list_item.settingsChoicesInline', {
        key: 'backgroundTheme'
      }, [
        m('label', i18n('background')),
        m('fieldset', [
          m('div.nice-radio', formWidgets.renderRadio(
            i18n('dark'),
            'bgTheme',
            'dark',
            settings.general.theme.background() === 'dark',
            e => {
              settings.general.theme.background(e.target.value);
              layout.onBackgroundChange(e.target.value);
            })),
          m('div.nice-radio', formWidgets.renderRadio(
            i18n('light'),
            'bgTheme',
            'light',
            settings.general.theme.background() === 'light',
            e => {
              settings.general.theme.background(e.target.value);
              layout.onBackgroundChange(e.target.value);
            })),
        ])])
    ]),
    window.oyunkeyf.version ? m('section.app_version', 'v' + window.oyunkeyf.version) : null
  ]);
}
