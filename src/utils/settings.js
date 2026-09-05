const SETTINGS_KEY = "sudoku_settings";

const DEFAULT_SETTINGS = {
  theme: "dark",
  soundEnabled: true,
  highlightEnabled: true,
  confirmRestart: true,
  autoSave: true,
  keyboardShortcuts: true,
};

function cloneDefaults() {
  return { ...DEFAULT_SETTINGS };
}

export function getSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      // Migrate legacy keys if they exist
      const legacyTheme = localStorage.getItem("sudoku_theme");
      const legacySound = localStorage.getItem("sudoku_sound");
      const legacyHighlight = localStorage.getItem("sudoku_highlight");
      const legacyRestart = localStorage.getItem("sudoku_confirm_restart");

      const migrated = {
        ...DEFAULT_SETTINGS,
        ...(legacyTheme ? { theme: legacyTheme } : {}),
        ...(legacySound ? { soundEnabled: legacySound !== "off" } : {}),
        ...(legacyHighlight ? { highlightEnabled: legacyHighlight !== "off" } : {}),
        ...(legacyRestart ? { confirmRestart: legacyRestart !== "off" } : {}),
      };

      saveSettings(migrated);
      return migrated;
    }

    const parsed = JSON.parse(raw);
    return {
      ...cloneDefaults(),
      ...(parsed || {}),
    };
  } catch (error) {
    console.error("Failed to load settings:", error);
    return cloneDefaults();
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error("Failed to save settings:", error);
    return false;
  }
}

export function updateSettings(patch) {
  const current = getSettings();
  const settings = {
    ...current,
    ...patch,
  };

  saveSettings(settings);
  return settings;
}

export function resetSettings() {
  const settings = cloneDefaults();
  saveSettings(settings);
  return settings;
}