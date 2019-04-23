import i18n from '../i18n';

export function playerName(player) {
  if (player.name || player.username || player.user) {
    let name = player.name || player.username || player.user.username;
    return name;
  }
  if (player.ai) {
    return aiName(player);
  }
  return 'Anonymous';
}

export function aiName(player) {
  return i18n('aiBot', 1);
}
