import m from 'mithril';

export default function homeCtrl() {
  const nbConnectedPlayers = m.prop();
  const nbGamesInPlay = m.prop();

  // function init() {
  //   if (isForeground()) {
  //     lobbyXhr(true).then(data => {
  //       socket.createLobby(data.lobby
  //     });
  //   }
  // }

  return {
    nbConnectedPlayers,
    nbGamesInPlay
  };
}
