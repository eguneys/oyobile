import i18n from '../../i18n';
import helper from '../helper';
import storage from '../../storage';
import socket from '../../socket';
import backbutton from '../../backbutton';
import gameApi from '../../oyunkeyf/game';
import m from 'mithril';

export default {
  controller: function(root) {
    const storageId = 'chat.' + root.data.game.id;

    let chatHeight;

    this.root = root;
    this.showing = false;
    this.messages = root.data.chat || [];
    this.inputValue = '';
    this.unread = false;

    var checkUnreadFromStorage = () => {
      var nbMessages = storage.get(storageId);
      if (this.messages && nbMessages < this.messages.length)
        this.unread = true;
    };
    checkUnreadFromStorage();
    storage.set(storageId, this.messages.length);

    this.open = () => {
      backbutton.stack.push(helper.slidesOutDown(this.close, 'chat'));
      this.showing = true;
    };

    this.close = (fromBB) => {
      window.cordova.plugins.Keyboard.close();
      if (fromBB !== 'backbutton' && this.showing) backbutton.stack.pop();
      this.showing = false;
      this.unread = false;
    };

    this.onReload = (messages) => {
      if (!messages) { return; }
      this.messages = messages;
      checkUnreadFromStorage();
      storage.set(storageId, this.messages.length);
    };

    this.append = (msg) => {
      this.messages.push(msg);
      storage.set(storageId, this.messages.length);
      if (msg.u !== 'oyunkeyf') this.unread = true;
      m.redraw();
    };

    // function onKeyboardShow(e) {
    // }

    // function onKeyboardHide(e) {
    // }

    // window.addEventListener('native.keyboardhide', onKeyboardHide);
    // window.addEventListener('native.keyboardshow', onKeyboardShow);

    this.onunload = () => {
      if (gameApi.playable(this.root.data)) storage.remove(storageId);
      // document.removeEventListener('native.keyboardhide', onKeyboardHide);
      // document.removeEventListener('native.keyboardshow', onKeyboardShow);
    };
  },
  view: function(ctrl) {
    if (!ctrl.showing) return null;
    return m('div#chat.modal', { config: helper.slidesInUp }, [
      m('header', [
        m('button.modal_close[data-icon=L]', {
          config: helper.ontouch(helper.slidesOutDown(ctrl.close, 'chat'))
        }),
        m('h2', i18n('chat'))
      ]),
      m('div.modal_content', [
        m('div#chat_scroller.native_scroller', {
          config: el => {
            el.scrollTop = el.scrollHeight;
          }
        }, [
          m('ul.chat_messages', ctrl.messages.map(function(msg, i, all) {
            var player = ctrl.root.data.player;

            var oyunkeyfTalking = msg.u === 'oyunkeyf';
            var playerTalking = msg.s ? msg.s === player.side :
                player.user && msg.u === player.user.username;
            var closeBalloon = true;
            var next = all[i + 1];
            var nextTalking;

            if (next) {
              nextTalking = next.s ? next.s === player.side :
                player.user && next.u === player.user.username;
            }
            if (!!nextTalking) closeBalloon = nextTalking !== playerTalking;

            return m('li.chat_msg.allow_select', {
              className: helper.classSet({
                system: oyunkeyfTalking,
                player: playerTalking,
                opponent: !oyunkeyfTalking && !playerTalking,
                'close_balloon': closeBalloon
              })
            }, [
              m.trust(msg.t)
            ]);
          }))
        ]),
        m('form.chat_form', {
          onsubmit: e => {
            e.preventDefault();
            const msg = e.target[0].value.trim();
            if (!msg) return;
            if (msg.length > 140) {
              return;
            }
            ctrl.inputValue = '';
            socket.send('talk', msg);
          }
        }, [
          m('input#chat_input.chat_input[type=text]', {
            placeholder: i18n('talkInChat'),
            autocomplete: 'off',
            value: ctrl.inputValue,
            config: function(el, isUpdate) {
              if (!isUpdate) {
                el.addEventListener('input', inputListener.bind(null, ctrl));
              }
            }
          }),
          m('button.chat_send[data-icon=z]')
        ])
      ])
    ]);
  }
};

function inputListener(ctrl, e) {
  ctrl.inputValue = e.target.value;
}
