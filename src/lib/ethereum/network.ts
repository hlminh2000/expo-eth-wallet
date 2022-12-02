export enum Networks {
  mainnet = "mainnet",
  sepolia = "sepolia",
}

export const getNetwork = (): Networks => {
  return process.env.NODE_ENV === "production"
    ? Networks.mainnet
    : Networks.sepolia;
};
