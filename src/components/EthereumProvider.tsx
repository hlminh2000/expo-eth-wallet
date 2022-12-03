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

const ASSETS = [AssetType.eth, AssetType.test];

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
  const [state, setState] = useState({ loading: true } as Ethereum);

  const { children } = props;

  useEffect(() => {
    (async () => {
      try {
        const wallet = await loadWallet(WalletStorageType.privateKey);
        const assets = await loadAssets(ASSETS, wallet);
        setState({ ...state, wallet, assets, loading: false });
      } catch (e) {
        setState({ ...state, loading: false });
      }
    })();
  }, []);

  return (
    <EthereumContext.Provider
      value={{
        ...state,
        createWallet: async () => {
          setState({ ...state, loading: true });
          await new Promise((res) => setTimeout(res, 0));
          const wallet = await createWallet();
          console.log("wallet: ", wallet);
          const assets = await loadAssets(ASSETS, wallet);
          console.log("assets: ", assets);
          setState({ ...state, wallet, assets, loading: false });
        },
        removeWallet: async () => {
          setState({ ...state, loading: true });
          await clearPrivateKey();
          setState({ ...state, wallet: undefined });
        },
      }}
    >
      {children}
    </EthereumContext.Provider>
  );
};

export default EthereumProvider;
