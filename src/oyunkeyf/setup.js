export function humanSetupFromSettings(settingsObj) {
  return {
    mode: settingsObj.mode(),
    variant: settingsObj.variant(),
    rounds: settingsObj.rounds()
  };
}
