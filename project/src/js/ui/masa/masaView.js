import h from '../helper';
import { header } from '../shared/common';
import { pad, formatMasaDuration, capitalize } from '../../utils';
import layout from '../layout';
import i18n from '../../i18n';
import m from 'mithril';
import tabs from '../shared/tabs';

export default function view(ctrl) {
  const bodyCtrl = masaListBody.bind(null, ctrl);

  return layout.free(header.bind(null, i18n('masas')), bodyCtrl);
}

const TABS = (i18n) => [{
  key: 'started',
  label: i18n('inProgressTables')
}, {
  key: 'created',
  label: i18n('openTables')
}, {
  key: 'finished',
  label: i18n('completed')
}];

function tabNavigation(currentTabFn) {
  return m('.nav-header', m.component(tabs, {
    buttons: TABS(i18n),
    selectedTab: currentTabFn(),
    onTabChange: k => {
      const loc = window.location.search.replace(/\?tab\=\w+$/, '');
      window.history.replaceState(null, null, loc + '?tab=' + k);
      currentTabFn(k);
    }
  }));
}

function masaListBody(ctrl) {
  if (!ctrl.masas()) return null;
  const tabContent = ctrl.masas()[ctrl.currentTab()];

  return m('.module-tabs.tabs-routing', [
    tabNavigation(ctrl.currentTab),
    m('.tab-content.layout.center-center.native_scroller',
      renderMasaList(tabContent, ctrl.currentTab())
     )
  ]);
}

function renderMasaList(list, id) {
  return (
    <table key={id} className='masaList'>
      {list.map(renderMasaListItem)}
    </table>
  );
}

function renderMasaListItem(masa) {
  const mode = masa.rated ? i18n('rated') : i18n('casual');
  const duration = formatMasaDuration(masa.rounds, masa.scores);
  const variant = capitalize(masa.variant.short);

  return (
    <tr key={masa.id}
    className={'list_item masa_item'}
    config={h.ontouchY(() => m.route('/masa/' + masa.id))}>
      <td className="masaListName" data-icon={masa.perf ? masa.perf.icon: '8'}>
        <div className="fullName">{masa.fullName}</div>
        <small className="infos"> {variant} {mode} • {duration} </small>
      </td>
      <td className="masaListTime">
        <div className="time">{formatTime(masa.createdAt)}</div>
        <small className="nbUsers withIcon" data-icon="r">{masa.nbPlayers}</small>
      </td>
      <td className="masaListNav">
        &#xf054;
      </td>
    </tr>
  );
}

function formatTime(timeInMillis) {
  const date = new Date(timeInMillis);
  const hours = pad(date.getHours().toString(), 2);
  const mins = pad(date.getMinutes().toString(), 2);
  return hours + ':' + mins;
}
