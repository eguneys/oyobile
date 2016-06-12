// scalaokey/src/main/scala/Status.scala

import i18n from '../i18n';

const ids = {
  created: 10,
  started: 20,
  aborted: 25,
  middleEnd: 30,
  normalEnd: 40,
  variantEnd: 70
};

function started(data) {
  return data.game.status.id >= ids.started;
}

function finished(data) {
  return data.game.status.id >= ids.middleEnd;
}

function aborted(data) {
  return data.game.status.id === ids.aborted;
}

function middleEnd(data) {
  return data.game.status.id === ids.middleEnd;
}


function playing(data) {
  return started(data) && !finished(data) && !aborted(data);
}

function toLabel(status, winner, variant) {
  switch (status) {
  case 'started':
    return i18n('playingRightNow');
  case 'aborted':
    return i18n('gameAborted');
  case 'middleEnd':
    return i18n('gameMiddleFinished');
  case 'normalEnd':
    return i18n('gameFinished');
  case 'variantEnd':
    return i18n('gameFinished');
  }
};

export default {
  ids,
  started,
  finished,
  aborted,
  playing,
  middleEnd,
  toLabel
};
