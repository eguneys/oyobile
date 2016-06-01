import m from 'mithril';

export default function homeCtrl() {
  const nbConnectedPlayers = m.prop();
  const nbGamesInPlay = m.prop();

  return {
    nbConnectedPlayers,
    nbGamesInPlay
  };
}
