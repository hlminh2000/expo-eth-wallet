import * as React from "react";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { ethers } from "ethers";
import { EthereumContext } from "./EthereumProvider";
import { Asset, AssetType } from "../lib/ethereum/assets";
import { Button, Text, Appbar, Chip, Card } from "react-native-paper";

const Wallet: React.ComponentType<{
  assets: Asset[];
  wallet: ethers.Wallet;
  createWallet: () => void;
  sendAsset: (
    to: string,
    amount: number,
    type: AssetType
  ) => Promise<ethers.providers.TransactionResponse>;
}> = (props) => {
  const [state, setState] = React.useState({ network: "" });
  const { network } = state;
  const { assets, wallet, createWallet, sendAsset } = props;

  React.useEffect(() => {
    (async () => {
      if (props.wallet) {
        const network = await props.wallet.provider.getNetwork();
        setState({ ...state, network: network.name });
      }
    })();
  }, []);

  return (
    <>
      <Appbar.Header>
        <Appbar.Action icon={"menu"} onPress={() => {}} />
        <Appbar.Content title="Wallet" />
        <Appbar.Action icon="plus" onPress={() => {}} />
      </Appbar.Header>
      {!wallet ? (
        <View>
          <Button mode="contained" onPress={createWallet}>
            Create Wallet
          </Button>
        </View>
      ) : (
        <View>
          <View style={{ margin: 10 }}>
            <View
              style={{
                margin: 10,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>Network: </Text>
              <Chip icon="network">{network}</Chip>
            </View>
            <View
              style={{
                margin: 10,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>Address: </Text>
              <Chip>{wallet.address.slice(0, 10)}...</Chip>
            </View>
          </View>
          {assets.map((asset) => (
            <Card key={asset.type} style={{ margin: 10 }}>
              <Card.Title title={asset.type}></Card.Title>
              <Card.Content style={{marginVertical: 5}}>
                <Chip>
                  <Text style={{ fontWeight: "bold" }}>{asset.balance}</Text>{" "}
                  {asset.type}
                </Chip>
              </Card.Content>
              <Card.Content style={{marginVertical: 5}}>
                <Button
                  mode="contained"
                  onPress={() =>
                    sendAsset(
                      "0x24440C989754C4Ab1636c24d19e19aAb9D068493",
                      0.1,
                      asset.type
                    )
                  }
                >
                  Send 0.1
                </Button>
              </Card.Content>
            </Card>
          ))}
        </View>
      )}
    </>
  );
};

const WalletWithData = () => (
  <EthereumContext.Consumer>
    {({ assets, wallet, createWallet, sendAsset, loading }) =>
      loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Wallet
          assets={assets}
          wallet={wallet}
          createWallet={createWallet}
          sendAsset={sendAsset}
        />
      )
    }
  </EthereumContext.Consumer>
);

export default WalletWithData;
