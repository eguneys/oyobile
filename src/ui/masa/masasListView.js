import h from 'mithril/hyperscript';
import i18n from '../../i18n';
import router from '../../router';
import * as helper from '../helper';
import { capitalize } from '../../utils';
import TabNavigation from '../shared/TabNavigation';
import TabView from '../shared/TabView';

const TABS = [{
  label: 'Açık'
}, {
  label: 'Oynanan'
}, {
  label: 'Biten'
}  
];

function onMasaTap(e) {
  const el = helper.getLI(e);
  const ds = el.dataset;
  if (el && ds.id) {
    router.set('/masa/' + ds.id);
  }
}

export function renderMasasList(ctrl) {
  if (!ctrl.masas) return null;

  const tabsContent = [
    ctrl.masas['created'],
    ctrl.masas['started'],
    ctrl.masas['finished'],
  ];

  return [
    h('div.tabs-nav-header.subHeader',
      h(TabNavigation, {
        buttons: TABS,
        selectedIndex: ctrl.currentTab,
        onTabChange: ctrl.onTabChange
      }),
      h('div.main_header_drop_shadow')
     ),
    h(TabView, {
      className: 'masaTabsWrapper',
      selectedIndex: ctrl.currentTab,
      content: tabsContent,
      renderer: renderMasaList,
      onTabChange: ctrl.onTabChange
    })
  ];
}

export function renderMasaList(list) {
  return h('ul.native_scroller.masaList', {
    oncreate: helper.ontapXY(onMasaTap, undefined, helper.getLI)
  }, list.map(renderMasaListItem));
}

function renderMasaListItem(masa, index) {
  const mode = masa.rated ? i18n('rated') : i18n('casual');
  const variant = capitalize(masa.variant.short);
  const evenOrOdd = index % 2 === 0 ? ' even ' : ' odd ';
  const scores = masa.scores;
  const rounds = masa.rounds;
  
  return (
      <li key={masa.id}
          className={'list_item masa_item' + evenOrOdd}
          data-id={masa.id}
      >
        <div className="masaListName">
          <div className="fullName">{masa.fullName}</div>
      <small className="infos">{variant} {mode} • {scores?scores + ' ' + i18n('points'):i18n('rounds', rounds)}</small>
        </div>
        <div className="masaListTime">
          <small className="nbUsers withIcon" data-icon="r">{masa.nbPlayers}</small>
        </div>
      </li>
  );
}

export function renderFooter() {
  return (
    <div className="actions_bar">
      <button key="createMasa" className="action_create_button">
        <span className="fa fa-plus-circle"/>
        {i18n('createANewMasa')}
      </button>
    </div>
  );
}
