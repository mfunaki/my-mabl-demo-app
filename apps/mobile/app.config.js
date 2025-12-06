module.exports = {
  expo: {
    name: 'Expense Mobile',
    slug: 'expense-mobile',
    version: '1.0.0',
    orientation: 'portrait',
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.expense.mobile',
    },
    android: {
      package: 'com.expense.mobile',
      usesCleartextTraffic: true,
    },
    plugins: [
      [
        'expo-build-properties',
        {
          android: {
            usesCleartextTraffic: true,
          },
        },
      ],
    ],
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000',
    },
  },
};
