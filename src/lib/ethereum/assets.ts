import { BigNumber, ethers } from "ethers";
import { Networks } from "./network";
import erc20ABI, { ERC20Contract } from "./contracts/erc20";

export enum AssetType {
  eth = "ETH",
  test = "MTST",
}

export interface Asset {
  type: AssetType;
  balance: number;
}

export const sendEther = async (args: {
  wallet: ethers.Wallet;
  to: string;
  amount: number;
}): Promise<ethers.providers.TransactionResponse> => {
  const { wallet, to, amount } = args;
  const network = await wallet.provider.getNetwork();
  const transaction = await wallet.sendTransaction({
    to,
    value: ethers.utils.parseEther(amount.toString()),
    chainId: network.chainId,
  });
  return transaction;
};

export const getEtherBalance = async (
  wallet: ethers.Wallet
): Promise<number> => {
  const balance = await wallet.provider.getBalance(wallet.address);
  return Number(ethers.utils.formatEther(balance));
};

export const loadAssets = async (
  assets: AssetType[],
  wallet: ethers.Wallet
): Promise<Asset[]> => {
  return await Promise.all(
    assets.map(async (asset: AssetType) => {
      const balance = await getEtherBalance(wallet);
      return {
        type: asset,
        balance: balance,
      };
    })
  );
};
