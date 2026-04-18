# Changelog

All notable changes to this project will be documented in this file.

## [1.4.0] - 2026-04-18

### Changed

- Support Expo SDK 53, 54, 55 (React Native 0.83)
- Upgrade: Chucker 4.2.0 (4.3.x incompatible with Kotlin 2.1.0 used by RN 0.83)
- Upgrade: expo-module-scripts 55.0.2
- Upgrade: Android compileSdkVersion/targetSdkVersion to 35, minSdkVersion to 24
- Fix: Native module name mismatch (ExpoChucker → Chucker)
- Fix: scripts.reset use pnpm instead of yarn

## [1.3.0] - 2026-01-24

### Added

- Feature: Add Wake Lock Permission with replace configuration in `AndroidManifest.xml`
- Feat: Improve Gradle Dependency Instal

### Changed

- Upgrade: Support for Expo >=52
- Upgrade: Using Chucker 4.1.0

## [0.1.5] - 2024-05-22

### Added

- Initial release
- Support for Expo SDK 51
- Using Chucker 4.0.0
