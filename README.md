# expo-chucker

Chucker wrapper in expo react native
Chucker is a library to inspect HTTP requests/responses on your Android device. https://github.com/ChuckerTeam/chucker

### Add the package to your npm dependencies

```bash
npm install expo-chucker

```

or

```bash
yarn add expo-chucker

```

### Add the expo plugin to your app

Add the plugin to your `app.json` / `app.config.ts` file.

```js
...
plugins: [
  'expo-chucker'
],

```

If you want to disabled the plugin in production, you can use the props `enabled: boolean` in the plugin configuration.

```js
plugins: [
  ['expo-chucker', { enabled: package === 'staging' }]
],
```

# Contributing

Contributions are very welcome! Please refer to guidelines described in the [contributing guide](https://github.com/expo/expo#contributing).
