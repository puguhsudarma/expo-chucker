import {
  AndroidConfig,
  ConfigPlugin,
  withGradleProperties,
  withPlugins,
} from "@expo/config-plugins";

// add flag enabled/disabled to activate chucker at dev discretion
const withEnabledFlag: ConfigPlugin<{ enabled: boolean }> = (
  config,
  { enabled }
) => {
  // adding CHUCKER_ENABLED flag to gradle.properties
  const gradleProperties = withGradleProperties(config, (gradleConfig) => {
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
  const permissions = AndroidConfig.Permissions.withPermissions(config, [
    "android.permission.POST_NOTIFICATIONS",
  ]);

  return permissions;
};

export const withExpoChucker: ConfigPlugin<{ enabled?: boolean }> = (
  config,
  { enabled }
) => {
  return withPlugins(config, [
    [withEnabledFlag, { enabled: enabled ?? true }],
    withPermission,
  ]);
};
