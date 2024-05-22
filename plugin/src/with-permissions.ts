import {
  AndroidConfig,
  ConfigPlugin,
  withAndroidManifest,
} from "@expo/config-plugins";

const withModifyWakeLockPermission: ConfigPlugin = (config) => {
  const PERMISSION_NAME = "android.permission.WAKE_LOCK";

  config = AndroidConfig.Permissions.withPermissions(config, [PERMISSION_NAME]);

  config = withAndroidManifest(config, async (config) => {
    if (!config.modResults) {
      throw new Error("No AndroidManifest found");
    }

    let androidManifest = config.modResults.manifest;

    if (!androidManifest) {
      throw new Error("No manifest found in AndroidManifest");
    }

    // add the tools to apply permission remove
    androidManifest.$ = {
      ...androidManifest.$,
      "xmlns:tools": "http://schemas.android.com/tools",
    };

    if (Array.isArray(androidManifest["uses-permission"])) {
      androidManifest["uses-permission"] = androidManifest[
        "uses-permission"
      ].map((permission) => {
        if (permission.$ && permission.$["android:name"] === PERMISSION_NAME) {
          permission.$["tools:node"] = "replace";
        }
        return permission;
      });
    }

    return config;
  });

  return config;
};

export const withPermissions: ConfigPlugin = (config) => {
  config = AndroidConfig.Permissions.withPermissions(config, [
    "android.permission.POST_NOTIFICATIONS",
  ]);

  config = withModifyWakeLockPermission(config);

  return config;
};
