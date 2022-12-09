module.exports = {
  expo: {
    name: "Swysh",
    slug: "quantropi-ethereum-wallet",
    privacy: "public",
    sdkVersion: "47.0.0",
    platforms: ["ios", "android"],
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    owner: "hlminh2000",
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
      bundleIdentifier: "com.anonymous.swyshwallet",
    },
    android: {
      package: "com.anonymous.swyshwallet",
    },
    extra: {
      NETWORK: process.env.NETWORK,
      eas: {
        projectId: "5f7c4ac8-38fe-44ec-8d9a-e61a730b0f88",
      },
    },
    plugins: ["./plugins/QiSpace/index.js"],
  },
};
