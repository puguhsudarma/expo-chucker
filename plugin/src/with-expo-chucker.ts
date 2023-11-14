import {
  AndroidConfig,
  ConfigPlugin,
  withAndroidManifest,
  withGradleProperties,
  withPlugins,
} from "@expo/config-plugins";
import { addPermission } from "@expo/config-plugins/build/android/Permissions";

// add flag enabled/disabled to activate chucker at dev discretion
const withFlagMetadataMainApplication: ConfigPlugin<{ enabled: boolean }> = (
  config,
  { enabled }
) => {
  // adding CHUCKER_ENABLED flag to gradle.properties
  const gradleProperties = withGradleProperties(config, (gradleConfig) => {
    gradleConfig.modResults =
      AndroidConfig.BuildProperties.updateAndroidBuildProperty(
        gradleConfig.modResults,
        "CHUCKER_ENABLED",
        enabled ? "true" : "false"
      );

    return gradleConfig;
  });

  return gradleProperties;
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
