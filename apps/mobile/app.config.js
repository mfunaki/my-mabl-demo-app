module.exports = {
  expo: {
    name: 'Expense Mobile',
    slug: 'expense-mobile',
    version: '1.0.1',
    orientation: 'portrait',
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'jp.mayoct.expense.mobile',
    },
    android: {
      package: 'jp.mayoct.expense.mobile',
      // HTTPSの場合はusesCleartextTrafficは不要
      // 本番環境ではfalseにする
      usesCleartextTraffic: false,
    },
    plugins: [
      [
        'expo-build-properties',
        {
          android: {
            usesCleartextTraffic: false,
          },
        },
      ],
    ],
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000',
      "eas": {
        "projectId": "9799947d-7655-4c9a-b7c2-7f500f1a0ff4"
      }
    },
  },
};
