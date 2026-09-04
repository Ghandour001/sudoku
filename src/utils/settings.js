const SETTINGS_KEY =
  "sudoku_settings";

const DEFAULT_SETTINGS = {
  theme: "dark",
  autoSave: true,
  keyboardShortcuts: true,
  mistakeHighlight: true,
  confirmNewGame: false,
};

function cloneDefaults() {
  return {
    ...DEFAULT_SETTINGS,
  };
}

export function getSettings() {
  try {
    const raw =
      localStorage.getItem(
        SETTINGS_KEY,
      );

    if (!raw) {
      return cloneDefaults();
    }

    const parsed = JSON.parse(raw);

    return {
      ...cloneDefaults(),
      ...(parsed || {}),
    };
  } catch (error) {
    console.error(
      "Failed to load settings:",
      error,
    );

    return cloneDefaults();
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(settings),
    );

    return true;
  } catch (error) {
    console.error(
      "Failed to save settings:",
      error,
    );

    return false;
  }
}

export function updateSettings(patch) {
  const settings = {
    ...getSettings(),
    ...patch,
  };

  saveSettings(settings);

  return settings;
}

export function resetSettings() {
  const settings =
    cloneDefaults();

  saveSettings(settings);

  return settings;
}