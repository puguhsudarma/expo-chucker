import {
  AndroidConfig,
  ConfigPlugin,
  withGradleProperties,
} from "@expo/config-plugins";

export const withEnabledFlag: ConfigPlugin<{ enabled: boolean }> = (
  config,
  { enabled }
) => {
  // adding CHUCKER_ENABLED flag to gradle.properties
  return withGradleProperties(config, (gradleConfig) => {
    const propertyName = "CHUCKER_ENABLED";

    AndroidConfig.BuildProperties.updateAndroidBuildProperty(
      gradleConfig.modResults,
      propertyName,
      enabled ? "true" : "false"
    );

    return gradleConfig;
  });
};
