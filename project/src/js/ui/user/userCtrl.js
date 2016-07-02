import session from '../../session';
import * as xhr from './userXhr';
import * as utils from '../../utils';
import helper from '../helper';
import socket from '../../socket';
import m from 'mithril';

export default function controller() {
  socket.createDefault();

  const user = m.prop();

  xhr.user(m.route.param('id')).then(user, error => {
    utils.handleXhrError(error);
    m.route('/');
  }).then(session.refresh);

  return {
    user,
    isMe: () => session.getUserId() === user().id
  };
}
