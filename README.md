# expo-chucker

A [Chucker](https://github.com/ChuckerTeam/chucker) wrapper for Expo.

Kudos to ChuckerTeam for providing this great library. It allows HTTP(S) inspector on Android devices, useful for network debugging when in release mode. At the time I wrote this library, there's no easy way to integrate Chucker with React Native especially in Expo project.

This will ONLY works on Android, and there's no plan to support iOS, as the Chucker does.

### Add the package to your npm dependencies

```bash
npm install expo-chucker

```

or

```bash
yarn add expo-chucker

```

### Add the Expo config-plugin

Add the plugin to your `app.json` / `app.config.ts` file.

```js
...
plugins: [
  'expo-chucker',
]

```

If you want to enable it only for staging, not the production build (obviously), there's an `enabled` props you can use. For example:

```js
plugins: [
  [
    "expo-chucker",
    {
      enabled: process.env.APP_ENV === "staging", // Only enable Chucker on staging environment
    },
  ],
];
```

Don't forget to prebuild your app each time you made changes to the config.

### Example App

1. Clone this repo
2. Run `yarn install` to install the dependencies
3. Run `yarn build` to build the expo plugin
4. Goto `example` directory
5. Run `yarn install` to install the dependencies for the example app
6. You need to have firebase project and get the `google-services.json` and `GoogleService-Info.plist` and put it in the `example/` directory. This is required for testing the push notification feature crashed by chucker library (see [here](https://github.com/ChuckerTeam/chucker/issues/1077))
7. Run `yarn prebuild` to prebuild the app
8. Run `yarn android` to run the app on android device or emulator

### Contributing

Contributions are very welcome!.
