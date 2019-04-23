import h from 'mithril/hyperscript';
import redraw from '../utils/redraw';
import session from '../session';
import * as utils from '../utils';
import i18n from '../i18n';
import signals from '../signals';
import * as helper from './helper';
import { handleXhrError } from '../utils';
import backbutton from '../backbutton';
import signupModal from './signupModal';
import { closeIcon } from './shared/icons';
import router from '../router';

let isOpen = false;
let formError = null;

export default {
  open,
  close,
  view() {
    if (!isOpen) return null;

    return h('div.modal#loginModal', { oncreate: helper.slidesInUp }, [
      h('header', [
        h('button.modal_close', {
          oncreate: helper.ontap(helper.slidesOutDown(close, 'loginModal'))
        }, closeIcon),
        h('h2', i18n('signIn'))
      ]),
      h('div.modal_content', [
        h('form.login', {
          onsubmit: (e) => {
            e.preventDefault();
            submit(e.target);
          }
        }, [
          formError ? h('div.form-error', formError): null,
          h('div.field', [
            h('input#username', {
              type: 'text',
              className: formError ? 'form-error':'',
              placeholder: i18n('username'),
              autocomplete: 'off',
              autocapitalize: 'off',
              autocorrect: 'off',
              spellcheck: false,
              required: true
            })
          ]),
          h('div.field', [
            h('input#password', {
              type: 'password',
              className: formError? 'form-error':'',
              placeholder: i18n('password'),
              required: true
            })
          ]),
          h('div.submit', [
            h('button.submitButton[data-icon=F]', i18n('signIn'))
          ])
        ]),
        h('div.signup', [
          i18n('newToOyunkeyf') + ' ',
          h('br'),
          h('a', {
            oncreate: helper.ontap(signupModal.open)
          }, [i18n('signUp')])
        ])
      ])
    ]);
  }
};

function open() {
  router.backbutton.stack.push(helper.slidesOutDown(close, 'loginModal'));
  isOpen = true;
  formError = null;
}

function close(fromBB) {
  window.Keyboard.hide();
  if (fromBB !== 'backbutton' && isOpen) router.backbutton.stack.pop();
  isOpen = false;
}

function submit(form) {
  const username = form['username'].value;
  const password = form['password'].value;
  if (!username || !password) return;

  redraw();
  window.Keyboard.hide();
  session.login(username, password)
    .then(() => {
      close();
      window.plugins.toast.show(i18n('loginSuccessful'), 'short', 'center');
      signals.afterLogin.dispatch();
      redraw();
      socket.reconnectCurrent();
      session.refresh();
    }).catch((err) => {
      if (err.status !== 400 && err.status !== 401) handleXhrError(err);
      else {
        if (err.body.global) {
          formError = err.body.global[0];
          redraw();
        }
      }
    });
  
}


// OLD

const loginModal = {};

function submitOLD(form) {
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

// export default loginModal;
