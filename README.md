# expo-chucker

A [Chucker](https://github.com/ChuckerTeam/chucker) wrapper for Expo.

Kudos to ChuckerTeam for providing this great library. It allows HTTP(S) inspector on Android devices, useful for network debugging when in release mode. At the time I wrote this library, there's no easy way to integrate Chucker with React Native especially in Expo project.

This will ONLY works on Android, and there's no plan to support iOS, as the Chucker does.

### Compatible Version

| expo-chucker | expo |
| :----------: | :--: |
|    1.3.0     |  52  |

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
2. Run `pnpm install` to install the dependencies
3. Run `pnpm build` to build the expo plugin
4. Goto `example` directory
5. Run `pnpm install` to install the dependencies for the example app
6. Run `pnpm prebuild --clean --no-install` to prebuild the app
7. Run `pnpm android --no-build-cache` to run the app on android device or emulator

### Contributing

Contributions are very welcome!.
