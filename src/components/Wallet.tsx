import * as React from "react";
import { View, ActivityIndicator, Clipboard } from "react-native";
import { EthereumContext } from "./EthereumProvider";
import { Button, Text, Appbar, Chip, Card, Menu } from "react-native-paper";
import { Network } from "@ethersproject/networks";

const Wallet: React.ComponentType<{}> = (props) => {
  const { assets, wallet, createWallet, removeWallet, loading } =
    React.useContext(EthereumContext);

  const [network, setNetwork] = React.useState<Network | null>(null);
  const [showNetworkMenu, setShowNetworkMenu] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      if (wallet) {
        console.log("retrieving networks from wallet", wallet);
        const network = await wallet.provider.getNetwork();
        console.log("network: ", network);
        setNetwork(network);
        const balance = await wallet.getBalance();
      }
    })();
  }, [wallet]);

  return (
    <>
      <Appbar.Header>
        <Appbar.Action icon={"menu"} onPress={() => {}} />
        <Appbar.Content title="Wallet" />
        <Appbar.Action icon="plus" onPress={() => {}} />
      </Appbar.Header>
      {loading ? (
        <View
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            padding: 10,
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      ) : !wallet ? (
        <View
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            padding: 10,
          }}
        >
          <Button mode="contained" onPress={createWallet}>
            Create Wallet
          </Button>
        </View>
      ) : (
        <View>
          <View
            style={{
              minHeight: 250,
              backgroundColor: "lightgrey",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                margin: 5,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Menu
                visible={showNetworkMenu}
                onDismiss={() => setShowNetworkMenu(false)}
                anchor={
                  <Chip
                    mode="outlined"
                    icon="network"
                    onPress={() => setShowNetworkMenu(!showNetworkMenu)}
                  >
                    {network?.name}
                  </Chip>
                }
              >
                <Menu.Item
                  title="Item 1"
                  onPress={() => setShowNetworkMenu(false)}
                ></Menu.Item>
                <Menu.Item
                  title="Item 2"
                  onPress={() => setShowNetworkMenu(false)}
                ></Menu.Item>
              </Menu>
            </View>
            <View
              style={{
                margin: 5,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Chip
                icon="wallet"
                onPress={() => Clipboard.setString(wallet.address)}
              >
                {wallet.address}
              </Chip>
            </View>
            <Button mode="outlined" onPress={removeWallet}>
              Remove Wallet
            </Button>
          </View>
          {assets.map((asset) => (
            <Card key={asset.type} style={{ margin: 10 }}>
              <Card.Title title={asset.type}></Card.Title>
              <Card.Content style={{ marginVertical: 5 }}>
                <Chip>
                  <Text style={{ fontWeight: "bold" }}>{asset.balance}</Text>{" "}
                  {asset.type}
                </Chip>
              </Card.Content>
            </Card>
          ))}
        </View>
      )}
    </>
  );
};

export default Wallet;
