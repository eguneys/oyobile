import popupWidget from './shared/popup';
import formWidgets from './shared/form';
import i18n from '../i18n';
import settings from '../settings';
import session from '../session';
import backbutton from '../backbutton';
import lobby from './lobby';
import m from 'mithril';

const newGameForm = {};

newGameForm.isOpen = false;

newGameForm.open = function() {
  backbutton.stack.push(newGameForm.close);
  newGameForm.isOpen = true;
};

newGameForm.close = function(fromBB) {
  if (fromBB !== 'backbutton' && newGameForm.isOpen) backbutton.stack.pop();
  newGameForm.isOpen = false;
};

newGameForm.openRealtime = function() {
  newGameForm.open();
};

function seekHumanGame() {
  newGameForm.close();
  lobby.startSeeking();
}

function renderForm(formName, action, settingsObj, variants) {
  var generalFieldset = [
    m('div.select_input', {
      key: formName + 'variant'
    }, [
      formWidgets.renderSelect('variant', formName + ' variant', variants, settingsObj.variant)
    ])
  ];
  

  // Human only
  if (settingsObj.mode) {
    var modes = (session.isConnected()) ? [
      ['casual', '0'],
      ['rated', '1']
    ] : [ ['casual', '0'] ];

    generalFieldset.push(m('div.select_input', {
      key: formName + 'mode'
    }, [
      formWidgets.renderSelect('mode', formName + 'mode', modes, settingsObj.mode)
    ]));

    if (session.isConnected()) {
      generalFieldset.push(
        formWidgets.renderCheckbox(i18n('membersOnly'), 'membersOnly', settingsObj.membersOnly));
    }
  }

  // both human
  var roundFieldset = [
    // m('div.select_input', {
    //   key: formName + 'rounds'
    // }, [
    //   formWidgets.renderSelect('round', formName + 'rounds', roundModes, settingsObj.roundMode)
    // ])
  ];

  if (true) {
    roundFieldset.push(
      m('div.select_input', {
        key: formName + 'rounds'
      }, [
        formWidgets.renderSelect('round', formName + 'round',
                                 settings.gameSetup.availableRounds, settingsObj.rounds, false)
      ])
    );
  }

  return m('form#new_game_form.game_form', {
    onsubmit: function(e) {
      e.preventDefault();
      if (!settings.gameSetup.isRoundValid(settingsObj)) return;
      newGameForm.close();
      action();
    }
  }, [
    m('fieldset', [
    ]),
    m('fieldset', generalFieldset),
    m('fieldset#round', roundFieldset),
    m('button[data-icon=E][type=submit].newGameButton', i18n('createAGame'))
  ]);
}

newGameForm.view = function() {
  function form() {
    return renderForm(
      'human',
      seekHumanGame,
      settings.gameSetup.human,
      settings.gameSetup.human.availableVariants);
};

  return popupWidget(
    'new_game_form_popup game_form_popup',
    null,
    form,
    newGameForm.isOpen,
    newGameForm.close
  );
};

export default newGameForm;
