export default {
  name: 'expense-mobile',
  slug: 'expense-mobile',
  owner: 'mayoct',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'jp.mayoct.mabl.expensemobile'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'jp.mayoct.mabl.expensemobile'
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro'
  },
  platforms: ['ios', 'android', 'web'],
  updates: {
    url: 'https://u.expo.dev/9799947d-7655-4c9a-b7c2-7f500f1a0ff4'
  },
  runtimeVersion: {
    policy: 'appVersion'
  },
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
    eas: {
      projectId: '9799947d-7655-4c9a-b7c2-7f500f1a0ff4'
    }
  }
};
