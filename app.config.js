module.exports = {
  expo: {
    name: "Swysh",
    slug: "swysh-wallet",
    privacy: "public",
    sdkVersion: "47.0.0",
    platforms: ["ios", "android"],
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      package: "com.anonymous.swyshwallet"
    },
    extra: {
      NETWORK: process.env.NETWORK,
    },
    plugins: [
      "./plugins/QiSpace/index.js"
    ]
  },
};
