# AGENTS.md — expo-chucker

Context file for AI agents working on this project. Read this before touching any files.

## What this project is

`expo-chucker` is an Expo native module that wraps [Chucker](https://github.com/ChuckerTeam/chucker) — an Android HTTP(S) inspector. It intercepts all OkHttp network traffic and surfaces it via Android notifications with a built-in inspector UI.

Published on npm: https://www.npmjs.com/package/expo-chucker  
GitHub: https://github.com/puguhsudarma/expo-chucker

## What it is NOT

- Not a JS library — no JavaScript API is exposed to the consuming app
- Not iOS compatible — Chucker is Android-only, this wrapper is Android-only
- Not a proxy/debug tool that requires desktop software — everything runs on-device

## How it works (technical)

1. Expo's autolinking registers `ChuckerModule` on app startup
2. `ChuckerModule.OnCreate` calls `OkHttpClientProvider.setOkHttpClientFactory(CustomNetworkModule(context))`
3. `CustomNetworkModule` adds `ChuckerInterceptor` to React Native's OkHttp client
4. All HTTP(S) traffic is intercepted and shown as Android notifications
5. The `enabled` plugin flag controls whether `library` or `library-no-op` is used (via `CHUCKER_ENABLED` in `gradle.properties`)

## Project structure

```
android/
  src/main/java/com/chucker/
    ChuckerModule.kt        — Expo module, registers OkHttp factory on OnCreate
    CustomNetworkModule.kt  — OkHttpClientFactory impl that adds ChuckerInterceptor
  build.gradle              — Android build config, Chucker dependency version here
plugin/src/
  index.ts                  — Config plugin entry
  with-expo-chucker.ts      — Composes sub-plugins
  with-enabled-flag.ts      — Writes CHUCKER_ENABLED to gradle.properties
  with-permissions.ts       — Adds POST_NOTIFICATIONS + WAKE_LOCK permissions
src/
  index.ts                  — Calls requireNativeModule("Chucker") to trigger OnCreate
expo-module.config.json     — Declares android platform + ChuckerModule class
example/                    — Test app (Android only)
```

## SDK compatibility

| expo-chucker | Expo SDK | React Native | Chucker | Android minSdk |
|:---:|:---:|:---:|:---:|:---:|
| 1.4.0 | 53, 54, 55 | 0.83.x | 4.2.0 | 24 |
| 1.3.0 | 52 | 0.76.x | 4.1.0 | 21 |
| 0.1.5 | 51 | — | 4.0.0 | — |

## Critical: Chucker version constraint

**Do NOT upgrade Chucker beyond 4.2.0 without checking Kotlin compatibility.**

- Chucker 4.3.0+ compiled with Kotlin 2.3.0
- React Native 0.83 (SDK 55) uses Kotlin compiler 2.1.0, which reads metadata up to 2.2.0 only
- Result: build fails with `Incompatible classes were found in dependencies`
- Chucker 4.2.0 (Kotlin 2.2.0) is the highest compatible version for RN 0.83

When upgrading Chucker in the future, check:
1. What Kotlin version was used to compile the new Chucker release (see GitHub releases)
2. What Kotlin compiler version ships with the target React Native version
3. Compiler N can read metadata up to N+1 minor. E.g., Kotlin 2.1 reads up to 2.2.

## Release process

1. Make changes
2. Update `version` in `package.json`, `android/build.gradle` (3 places: `version`, `versionCode`, `versionName`)
3. Update `CHANGELOG.md`
4. Update compatibility table in `README.md`
5. Run `pnpm install && pnpm build`
6. Test on Android: `cd example && pnpm prebuild --clean --no-install && pnpm android --no-build-cache`
7. Commit and push, then create a GitHub Release — this triggers the publish workflow

Versioning: follow semver.
- Patch: bug fixes with no user-facing change
- Minor: new Expo SDK support, dependency upgrades, no breaking changes
- Major: breaking changes to plugin API or install flow

## Build/dev commands

```bash
pnpm install          # install root deps
pnpm build            # build TS + plugin
pnpm lint             # lint
pnpm release          # bump version + tag + publish (uses release-it)
```

Example app (full test flow):
```bash
# 1. root — installs deps + auto-builds plugin via prepare script
pnpm install

# 2. example app
cd example
pnpm install
pnpm prebuild --clean --no-install   # regenerate android/ from config plugin
pnpm android --no-build-cache        # build APK + start Expo dev server + launch on device
```

## Known constraints

- `OkHttpClientProvider` is a React Native Legacy Architecture API. It still works in New Architecture (SDK 55) but should be monitored in future RN versions.
- `expo-module-scripts` version must match the target Expo SDK major version (e.g., `^55.x.x` for SDK 55).
- The module name in `ModuleDefinition { Name("Chucker") }` must match `requireNativeModule("Chucker")` in `src/index.ts`.
