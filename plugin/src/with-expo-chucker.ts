import {
  AndroidConfig,
  ConfigPlugin,
  withAndroidManifest,
  withPlugins,
} from "@expo/config-plugins";
import { addPermission } from "@expo/config-plugins/build/android/Permissions";

// add flag enabled/disabled to activate chucker at dev discretion
const withFlagMetadataMainApplication: ConfigPlugin<{ enabled?: boolean }> = (
  config,
  { enabled }
) => {
  return withAndroidManifest(config, async (config) => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults
    );

    const isEnabled = typeof enabled === "undefined" ? true : enabled;

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      "CHUCKER_ENABLED",
      isEnabled ? "true" : "false"
    );

    return config;
  });
};

const withPermission: ConfigPlugin = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;

    addPermission(androidManifest, "android.permission.POST_NOTIFICATIONS");

    return config;
  });
};

export const withExpoChucker: ConfigPlugin<{ enabled?: boolean }> = (
  config,
  { enabled } = { enabled: true }
) => {
  return withPlugins(config, [
    [withFlagMetadataMainApplication, { enabled }],
    withPermission,
  ]);
};
