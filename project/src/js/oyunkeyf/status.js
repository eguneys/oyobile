// scalaokey/src/main/scala/Status.scala

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


function playing(data) {
  return started(data) && !finished(data) && !aborted(data);
}

export default {
  ids,
  started,
  finished,
  aborted,
  playing
};
