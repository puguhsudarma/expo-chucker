import { ExpoConfig } from "expo/config";

export default (): ExpoConfig => {
  return {
    name: "expo-chucker-example",
    slug: "expo-chucker-example",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.chucker.example",
      googleServicesFile: "./GoogleService-Info.plist",
      privacyManifests: {
        NSPrivacyAccessedAPITypes: [
          {
            NSPrivacyAccessedAPIType:
              "NSPrivacyAccessedAPICategoryUserDefaults",
            NSPrivacyAccessedAPITypeReasons: ["CA92.1"],
          },
        ],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.chucker.example",
      googleServicesFile: "./google-services.json",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      "@react-native-firebase/app",
      [
        "expo-build-properties",
        {
          android: {
            extraMavenRepos: [
              "../../node_modules/@notifee/react-native/android/libs",
            ],
          },
          ios: {
            useFrameworks: "static",
          },
        },
      ],
      [
        "../app.plugin.js",
        {
          enabled: true,
        },
      ],
    ],
  };
};
