import { ethers } from "ethers";
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

const TOKENS = {
  [Networks.mainnet]: {
    [AssetType.test]: "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359",
  },
  [Networks.sepolia]: {
    // [AssetType.dai]: "0xad6d458402f60fd3bd25163575031acdce07538d",
    // [AssetType.dai]: "0x6aacd5f7ab64d98bccdc4260b3b8cff6b678e70e",
    [AssetType.test]: "0xCf2d404c086Da0123Fdb40987173264bAb55D953",
  },
};

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

export const sendToken = async (args: {
  wallet: ethers.Wallet;
  to: string;
  amount: number;
  type: AssetType;
}): Promise<ethers.providers.TransactionResponse> => {
  const { wallet, to, amount, type } = args;

  if (type === AssetType.eth)
    throw new Error("Use sendEther function to send ETH");

  const network = await wallet.provider.getNetwork();
  const tokenAddress = TOKENS[network.name as Networks][type];
  const contract = new ethers.Contract(
    tokenAddress,
    erc20ABI,
    wallet
  ) as ERC20Contract;
  const decimals = await contract.decimals();
  const transaction = await contract.transfer(
    to,
    ethers.utils.parseUnits(amount.toString(), decimals)
  );
  return transaction;
};

export const getEtherBalance = async (
  wallet: ethers.Wallet
): Promise<number> => {
  const balance = await wallet.provider.getBalance(wallet.address);
  return Number(ethers.utils.formatEther(balance));
};

export const getTokenBalance = async (
  tokenAddress: string,
  wallet: ethers.Wallet
): Promise<number> => {
  const contract = new ethers.Contract(
    tokenAddress,
    erc20ABI,
    wallet
  ) as ERC20Contract;
  const balance: ethers.utils.BigNumber = await contract.balanceOf(
    wallet.address
  );
  const decimals: number = await contract.decimals();
  const tokenBalance = ethers.utils.formatUnits(balance, decimals);
  return Number(tokenBalance);
};

export const loadAssets = async (
  assets: AssetType[],
  wallet: ethers.Wallet
): Promise<Asset[]> => {
  const network = await wallet.provider.getNetwork();
  const tokensAddresses = TOKENS[network.name as Networks];
  return await Promise.all(
    assets.map(async (asset: AssetType) => {
      if (asset === AssetType.eth) {
        const balance = await getEtherBalance(wallet);
        return {
          type: asset,
          balance: balance,
        };
      } else {
        const balance = await getTokenBalance(tokensAddresses[asset], wallet);
        return {
          type: asset,
          balance: balance,
        };
      }
    })
  );
};
