import h from 'mithril/hyperscript';
import * as helper from './helper';
import { humanSetupFromSettings } from '../oyunkeyf/setup';
import popupWidget from './shared/popup';
import formWidgets from './shared/form';
import i18n from '../i18n';
import router from '../router';
import settings from '../settings';
import session from '../session';
import backbutton from '../backbutton';
import * as xhr from '../xhr';
import lobby from './lobby';
import m from 'mithril';

let isOpen = false;

const humanSetup = settings.gameSetup.human;

export default {
  open,
  close,
  openRealtime() {
    open();
  },
  view() {
    return popupWidget(
      'new_game_form_popup game_form_popup',
      undefined,
      renderContent,
      isOpen,
      close);
  }
};

function open() {
  router.backbutton.stack.push(close);
  isOpen = true;
}

function close(fromBB) {
  if (fromBB !== 'backbutton' && isOpen) router.backbutton.stack.pop();
  isOpen = false;
}

function renderContent() {
  const conf = humanSetup;

  return h('div', [
    h('div.newGame-preset_switch', [
      renderCustomSetup(
        'human',
        conf,
        conf.availableVariants
      )
    ])
  ]);
}

function renderCustomSetup(formName, settingsObj, variants) {
  const generalFieldset = [
    h('div.select_input', {
      key: formName + 'variant'
    }, formWidgets.renderSelect('variant', formName + 'variant', variants, settingsObj.variant)
     )
  ];

  const modes = [
    ['casual', '0'],
    ['rated', '1']
  ];

  generalFieldset.push(h('div.select_input', {
    key: formName + 'mode'
  }, formWidgets.renderSelect('mode', formName + 'mode', modes, settingsObj.mode)
                        ));

  const timeFieldset = [];

  timeFieldset.push(
    h('div.select_input.inline', {
      key: formName + 'round'
    },
      formWidgets.renderSelect('rounds', formName + 'rounds',
                               settings.gameSetup.availableRounds, settingsObj.rounds, false)
     )
  );

  return h('form.game_form', {
    key: 'customSetup',
    onsubmit(e) {
      e.preventDefault();
      close();
      goSeek(humanSetupFromSettings(settingsObj));
    }
  }, [
    h('fieldset', generalFieldset),
    h('fieldset', timeFieldset),
    h('div.popupActionWrapper', [
      h('button[data-icon=E][type=submit].popupAction', i18n('createAGame'))
    ])
  ]);
}

export function renderQuickSetup(onCustom) {
  return h('div.newGame-pools', { key: 'quickSetup' },
           h('div.newGame-pool', {
             key: 'pool-custom',
             oncreate: helper.ontap(onCustom)
           }, h('div.newGame-custom', 'Özel')
            )
          );
}

function goSeek(conf) {
  close();

  lobby.startSeeking(conf);
}

// export function renderQuickSetup() {
//   return h('div.newGame-pools', { key: 'quickSetup' },
//            xhr.cachedPools.map(p => renderPool(p))
//           );
// }

// function renderPool(p) {
//   return h('div.newGame-pool', {
//     key: 'pool-' + p.id,
//     oncreate: helper.ontap(() => {
//       console.log('oncreate');
//     })
//   }, [h('div.newGame-rounds', p.id),
//       h('div.newGame-perf', p.perf)
//      ]);
// }

// const newGameForm = {};

// newGameForm.isOpen = false;

// newGameForm.open = function() {
//   backbutton.stack.push(newGameForm.close);
//   newGameForm.isOpen = true;
// };

// newGameForm.close = function(fromBB) {
//   if (fromBB !== 'backbutton' && newGameForm.isOpen) backbutton.stack.pop();
//   newGameForm.isOpen = false;
// };

// newGameForm.openRealtime = function() {
//   newGameForm.open();
// };

// function seekHumanGame() {
//   newGameForm.close();
//   lobby.startSeeking();
// }

// function renderForm(formName, action, settingsObj, variants) {
//   var generalFieldset = [
//     m('div.select_input', {
//       key: formName + 'variant'
//     }, [
//       formWidgets.renderSelect('variant', formName + ' variant', variants, settingsObj.variant)
//     ])
//   ];
  

//   // Human only
//   if (settingsObj.mode) {
//     var modes = (session.isConnected()) ? [
//       ['casual', '0'],
//       ['rated', '1']
//     ] : [ ['casual', '0'] ];

//     generalFieldset.push(m('div.select_input', {
//       key: formName + 'mode'
//     }, [
//       formWidgets.renderSelect('mode', formName + 'mode', modes, settingsObj.mode)
//     ]));

//     if (session.isConnected() && settingsObj.mode() === '0') {
//       generalFieldset.push(
//         formWidgets.renderCheckbox(i18n('membersOnly'), 'membersOnly', settingsObj.membersOnly));
//     }
//   }

//   // both human
//   var roundFieldset = [
//     // m('div.select_input', {
//     //   key: formName + 'rounds'
//     // }, [
//     //   formWidgets.renderSelect('round', formName + 'rounds', roundModes, settingsObj.roundMode)
//     // ])
//   ];

//   if (true) {
//     roundFieldset.push(
//       m('div.select_input', {
//         key: formName + 'rounds'
//       }, [
//         formWidgets.renderSelect('rounds', formName + 'round',
//                                  settings.gameSetup.availableRounds, settingsObj.rounds, false)
//       ])
//     );
//   }

//   return m('form#new_game_form.game_form', {
//     onsubmit: function(e) {
//       e.preventDefault();
//       if (!settings.gameSetup.isRoundValid(settingsObj)) return;
//       newGameForm.close();
//       action();
//     }
//   }, [
//     m('fieldset', [
//     ]),
//     m('fieldset', generalFieldset),
//     m('fieldset#round', roundFieldset),
//     m('button[data-icon=E][type=submit].newGameButton', i18n('createAGame'))
//   ]);
// }

// newGameForm.view = function() {
//   function form() {
//     return renderForm(
//       'human',
//       seekHumanGame,
//       settings.gameSetup.human,
//       settings.gameSetup.human.availableVariants);
// };

//   return popupWidget(
//     'new_game_form_popup game_form_popup',
//     null,
//     form,
//     newGameForm.isOpen,
//     newGameForm.close
//   );
// };

// export default newGameForm;
