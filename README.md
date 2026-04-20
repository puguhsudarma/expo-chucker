# expo-chucker

[![npm version](https://img.shields.io/npm/v/expo-chucker.svg)](https://www.npmjs.com/package/expo-chucker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform: Android](https://img.shields.io/badge/Platform-Android-green.svg)](https://developer.android.com)

An [Expo](https://expo.dev) wrapper for [Chucker](https://github.com/ChuckerTeam/chucker) — an in-app HTTP(S) inspector for Android. Useful for network debugging without needing a proxy or desktop tools.

> **Android only.** Chucker has no iOS equivalent, so this library does not support iOS.

## How it works

Once installed and configured, expo-chucker automatically intercepts all HTTP(S) traffic made by your app via React Native's OkHttp client. Intercepted requests appear as Android notifications. Tap a notification to open the Chucker inspector UI.

No JavaScript API is exposed — the module initializes itself on app startup via Expo's autolinking.

## Compatible Versions

| expo-chucker | expo     | chucker |
| :----------: | :------: | :-----: |
|    1.4.1     | 53,54,55 |  4.2.0  |
|    1.4.0     | 53,54,55 |  4.2.0  |
|    1.3.0     | 52       |  4.1.0  |
|    0.1.5     | 51       |  4.0.0  |

> **New Architecture**: expo-chucker 1.4.0 supports Expo SDK 55 which requires New Architecture (React Native 0.83).

## Installation

```bash
npx expo install expo-chucker
```

Or with npm/yarn/pnpm:

```bash
npm install expo-chucker
# or
yarn add expo-chucker
# or
pnpm add expo-chucker
```

## Setup

### 1. Add the config plugin

In your `app.json` or `app.config.ts`:

```json
{
  "plugins": ["expo-chucker"]
}
```

### 2. Enable only for non-production builds (recommended)

```js
// app.config.ts
export default {
  plugins: [
    [
      "expo-chucker",
      {
        enabled: process.env.APP_ENV !== "production",
      },
    ],
  ],
};
```

When `enabled` is `false`, the library-no-op variant of Chucker is used — zero overhead in production.

### 3. Prebuild

```bash
npx expo prebuild --clean
```

Run prebuild again whenever you change the plugin config.

## Usage

Nothing to import. Once installed and prebuilt, Chucker intercepts all OkHttp traffic automatically. HTTP requests appear as Android notifications — tap to inspect request/response details.

## Permissions

The config plugin automatically adds these Android permissions:

- `POST_NOTIFICATIONS` — required to show Chucker notifications
- `WAKE_LOCK` — required by Chucker's notification service

## Development / Example App

```bash
# from repo root
pnpm install
pnpm build

# then in example/
cd example
pnpm install
pnpm prebuild --clean --no-install
pnpm android --no-build-cache
```

## Contributing

Contributions are welcome. Please open an issue first for major changes.

See [CHANGELOG.md](./CHANGELOG.md) for release history.
