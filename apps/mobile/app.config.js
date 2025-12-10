export default {
  name: 'expense-mobile',
  slug: 'expense-mobile',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.example.expensemobile'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.example.expensemobile'
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro'
  },
  platforms: ['ios', 'android', 'web'],
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL
  }
};
