import session from '../session';
import * as utils from '../utils';
import i18n from '../i18n';
import helper from './helper';
import backbutton from '../backbutton';
import signupModal from './signupModal';
import m from 'mithril';

const loginModal = {};

var isOpen = false;

function submit(form) {
  const login = form[0].value.trim();
  const pass = form[1].value;
  if (!login || !pass) return false;
  window.cordova.plugins.Keyboard.close();
  return session.login(login, pass).then(function() {
    loginModal.close();
    window.plugins.toast.show(i18n('loginSuccessful'), 'short', 'center');
    // push.register();
    session.refresh()
      .catch(err => {
        if (err.status === 401) {
          // https://github.com/veloce/lichobile/blob/master/project/src/js/ui/loginModal.js#L28
          window.navigator.notification.alert('oyunkeyfAuthenticationCannotWorkWithoutCookies');
        }
      });
  })
    .catch(utils.handleXhrError);
}

loginModal.open = function() {
  backbutton.stack.push(helper.slidesOutDown(loginModal.close, 'loginModal'));
  isOpen = true;
};

loginModal.close = function(fromBB) {
  window.cordova.plugins.Keyboard.close();
  if (fromBB !== 'backbutton' && isOpen) backbutton.stack.pop();
  isOpen = false;
};

loginModal.view = function() {
  if (!isOpen) return null;

  return m('div.modal#loginModal', { config: helper.slidesInUp }, [
    m('header', [
      m('button.modal_close[data-icon=L]', {
        config: helper.ontouch(helper.slidesOutDown(loginModal.close, 'loginModal'))
      }),
      m('h2', i18n('signIn'))
    ]),
    m('div.modal_content', [
      m('form.login', {
        onsubmit: function(e) {
          e.preventDefault();
          return submit(e.target);
        }
      }, [
        m('input#pseudo[type=text]', {
          placeholder: i18n('username'),
          autocomplete: 'off',
          autocapitalize: 'off',
          autocorrect: 'off',
          spellcheck: 'false',
          required: true
        }),
        m('input#password[type=password]', {
          placeholder: i18n('password'),
          required: true
        }),
        m('button.fat', i18n('signIn'))
      ]),
      m('div.signup', [
        m('a', {
          config: helper.ontouch(signupModal.open)
        }, [i18n('newToOyunkeyf'), ' ', i18n('signUp')])
      ])
    ])
  ]);
};

export default loginModal;
