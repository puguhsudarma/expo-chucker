import {
  AndroidConfig,
  ConfigPlugin,
  withAndroidManifest,
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
    "android.permission.WAKE_LOCK",
  ]);

  return permissions;
};

const withModifyWakeLockPermission: ConfigPlugin = (config) => {
  return withAndroidManifest(config, async (config) => {
    let androidManifest = config.modResults.manifest;

    // add the tools to apply permission remove
    androidManifest.$ = {
      ...androidManifest.$,
      "xmlns:tools": "http://schemas.android.com/tools",
    };

    // add remove property to the audio record permission
    androidManifest["uses-permission"] = androidManifest[
      "uses-permission"
    ]?.map((perm) => {
      if (perm.$["android:name"] === "android.permission.WAKE_LOCK") {
        perm.$["tools:node"] = "replace";
      }
      return perm;
    });

    return config;
  });
};

export const withExpoChucker: ConfigPlugin<{ enabled?: boolean }> = (
  config,
  { enabled }
) => {
  return withPlugins(config, [
    [withEnabledFlag, { enabled: enabled ?? true }],
    withPermission,
    withModifyWakeLockPermission,
  ]);
};
