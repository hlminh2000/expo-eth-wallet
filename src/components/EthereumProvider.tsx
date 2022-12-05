import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  clearPrivateKey,
  createWallet,
  loadWallet,
  sendAsset,
  WalletStorageType,
} from "../lib/ethereum/wallet";
import { loadAssets, AssetType, Asset } from "../lib/ethereum/assets";

const ASSETS = [AssetType.eth, AssetType.mtst];

export interface Ethereum {
  wallet?: ethers.Wallet;
  assets: Asset[];
  createWallet: () => void;
  removeWallet: () => void;
  loading: boolean;
}

export const EthereumContext = React.createContext({} as Ethereum);

interface EthereumProviderProps {
  children: JSX.Element;
}

const EthereumProvider: React.ComponentType<EthereumProviderProps> = (
  props
) => {
  const [wallet, setWallet] = useState<ethers.Wallet | undefined>();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { children } = props;

  useEffect(() => {
    (async () => {
      try {
        const wallet = await loadWallet(WalletStorageType.privateKey);
        const assets = await loadAssets(ASSETS, wallet);
        setWallet(wallet);
        setAssets(assets);
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (wallet) {
      const interval = setInterval(async () => {
        console.log("yooo!!!");
        setAssets(await loadAssets(ASSETS, wallet));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [wallet]);

  return (
    <EthereumContext.Provider
      value={{
        loading,
        wallet,
        assets,
        createWallet: async () => {
          setLoading(true);
          await new Promise((res) => setTimeout(res, 0));
          const wallet = await createWallet();
          console.log("wallet: ", wallet);
          const assets = await loadAssets(ASSETS, wallet);
          console.log("assets: ", assets);
          setWallet(wallet);
          setAssets(assets);
          setLoading(false);
        },
        removeWallet: async () => {
          setLoading(true);
          await clearPrivateKey();
          setWallet(undefined);
          setLoading(false);
        },
      }}
    >
      {children}
    </EthereumContext.Provider>
  );
};

export default EthereumProvider;
