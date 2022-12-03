import Constants from "expo-constants";

export const Networks = {
  mainnet: "mainnet",
  development: Constants?.expoConfig?.extra?.NETWORK || "sepolia",
};

console.log("Networks: ", Networks);

export const getNetwork = (): string => {
  return process.env.NODE_ENV === "production"
    ? Networks.mainnet
    : Networks.development;
};
