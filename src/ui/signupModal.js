import h from 'mithril/hyperscript';
import socket from '../socket';
import redraw from '../utils/redraw';
import session from '../session';
import i18n from '../i18n';
import * as helper from './helper';
import router from '../router';
import loginModal from './loginModal';
import backbutton from '../backbutton';
import { closeIcon } from './shared/icons';

let isOpen = false;
let loading = false;

let formError = null;

export default {
  open,
  close,
  view() {
    if (!isOpen) return null;

    return h('div.modal#signupModal', { oncreate: helper.slidesInUp }, [
      h('header', [
        h('button.modal_close', {
          oncreate: helper.ontap(helper.slidesOutDown(close, 'signupModal'))
        }, closeIcon),
        h('h2', i18n('signUp'))
      ]),
      h('div#signupModalContent.modal_content', {
        className: loading ? 'loading' : ''
      }, renderForm())
    ]);
  }
};

function renderForm() {
  return [
    h('form.login', {
      onsubmit: function(e) {
        e.preventDefault();
        return submit(e.target);
      }
    }, [
      h('div.field', [
        formError && formError.username ?
          h('div.form-error', formError.username[0]) : null,
        h('input#pseudo[type=text]', {
          className: formError && formError.username ? 'form-error': '',
          placeholder: i18n('username'),
          autocomplete: 'off',
          autocapitalize: 'off',
          autocorrect: 'off',
          spellcheck: false,
          required: true,
          onfocus: scrollToTop
        }),
      ]),
      h('div.field', [
        formError && formError.email ?
          h('div.form-error', formError.email[0]): null,
        h('input#email[type=email]', {
          onfocus: scrollToTop,
          className: formError && formError.email ? 'form-error' : '',
          placeholder: i18n('email'),
          autocapitalize: 'off',
          autocorrect: 'off',
          spellcheck: false,
          required: true
        })
      ]),
      h('div.field', [
        formError && formError.password ?
          h('div.form-error', formError.password[0]) : null,
        h('input#password[type=password]', {
          onfocus: scrollToTop,
          className: formError && formError.password ? 'form-error' : '',
          placeholder: i18n('password'),
          required: true
        })
      ]),
      h('div.submit', [
        h('button.submitButton[data-icon=F]', i18n('signUp'))
      ])
    ])
  ];
}

function scrollToTop(e) {
  setTimeout(() => {
    const el = e.target;
    el.scrollIntoView(true);
  }, 300);
}

function submit(form) {
  const login = form[0].value.trim();
  const email = form[1].value.trim();
  const pass = form[2].value.trim();
  if (!login || !email || !pass) return;
  window.Keyboard.hide();
  loading = true;
  formError = null;
  redraw();
  session.signup(login, email, pass)
    .then(d => {
      window.plugins.toast.show(i18n('loginSuccessful'), 'short', 'center');
      socket.reconnectCurrent();
      redraw();
      loginModal.close();
      close();
    }).catch((error) => {
      if (isSubmitError(error)) {
        loading = false;
        formError = error.body.error;
        redraw();
      } else {
        handleXhrError(error);
      }
    });
}

function isSubmitError(err) {
  return err.body.error !== undefined;
}

function open() {
  router.backbutton.stack.push(helper.slidesOutDown(close, 'signupModal'));
  formError = null;
  isOpen = true;
}

function close(fromBB) {
  window.Keyboard.hide();
  if (fromBB !== 'backbutton' && isOpen) router.backbutton.stack.pop();
  isOpen = false;
}

// const signupModal = {};

// var isOpen = false;

// function submit(form) {
//   var login = form[0].value.trim();
//   var email = form[1].value.trim();
//   var pass = form[2].value.trim();
//   if (!login || !email || !pass) return false;
//   window.cordova.plugins.Keyboard.close();
//   return session.signup(login, email, pass).then(function() {
//     signupModal.close();
//     loginModal.close();
//     window.plugins.toast.show(i18n('loginSuccessfull'), 'short', 'center');
//   }, function(error) {
//     var data = error.response;
//     if (data.error.username) {
//       window.plugins.toast.show(data.error.username[0], 'short', 'center');
//     } else if (data.error.password) {
//       window.plugins.toast.show(data.error.password[0], 'short', 'center');
//     }
//   });
// }

// signupModal.open = function() {
//   backbutton.stack.push(helper.slidesOutDown(signupModal.close, 'signupModal'));
//   isOpen = true;
// };

// signupModal.close = function(fromBB) {
//   window.cordova.plugins.Keyboard.close();
//   if (fromBB !== 'backbutton' && isOpen) backbutton.stack.pop();
//   isOpen = false;
// };

// signupModal.view = function() {
//   if (!isOpen) return null;

//   return m('div.modal#signupModal', { config: helper.slidesInUp }, [
//     m('header', [
//       m('button.modal_close[data-icon=L]', {
//         config: helper.ontouch(helper.slidesOutDown(signupModal.close, 'signupModal'))
//       }),
//       m('h2', i18n('signUp'))
//     ]),
//     m('div.modal_content', [
//       m('p.signupWarning.withIcon[data-icon=!]', [
//         i18n('computersAreNotAllowedToPlay')
//       ]),
//       m('p.tosWarning', [
//         i18n('byRegisteringYouAgreeToBeBoundByOur'),
//         m('a', {
//         }, i18n('termsOfService')), '.'
//       ]),
//       m('form.login', {
//         onsubmit: function(e) {
//           e.preventDefault();
//           return submit(e.target);
//         }
//       }, [
//         m('input#pseudo[type=text]', {
//           placeholder: i18n('username'),
//           autocomplete: 'off',
//           autocapitalize: 'off',
//           autocorrect: 'off',
//           spellcheck: 'false',
//           required: true
//         }),
//         m('input#email[type=email]', {
//           placeholder: i18n('email'),
//           autocomplete: 'off',
//           autocapitalize: 'off',
//           autocorrect: 'off',
//           spellcheck: 'false',
//           required: true
//         }),
//         m('input#password[type=password]', {
//           placeholder: i18n('password'),
//           required: true
//         }),
//         m('button.fat', i18n('signUp'))
//       ])
//     ])
//   ]);
// };

// export default signupModal;
