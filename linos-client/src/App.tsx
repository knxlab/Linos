import { Box, Button, Toolbar } from "@mui/material";

import "./App.css";
// eslint-disable-next-line
// @ts-ignore
import { useEth } from "./contexts/EthContext";

import { FullWithHeightFlex } from "./Layout/FullWidthHeightFlex";
import Title from "./Layout/Title";
import MetaMaskLoginBtn from "./components/MetaMaskLoginBtn";
import Routes from "./Routes";
import { LinosContextProvider } from "./contexts/Linos/Context";
import { useEffect } from "react";

export function AppLoadEth() {
  const { state: { ready, networkID }} = useEth();

  console.log("networkID", networkID);

  const addLinosNetwork = async () => {
    try {
      // @ts-ignore
      // const chainId = await window.ethereum.request({ method: 'eth_chainId' })
      // console.log("chainId", chainId);
      // @ts-ignore
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: "0x9893E9", // 9999337
            chainName: "Linos",
            rpcUrls: ['https://preprod.linos.wtf:9545/'],
            nativeCurrency: {
              name: "Ether",
              symbol: "Eth",
              decimals: 18
            }
          },
        ],
      });
    } catch (addError) {
      console.error(addError);
    }
  }

  useEffect(() => {

  }, []);

  if (!ready) {
    return (
      <FullWithHeightFlex>
        <Title>Welcome to Linos</Title>
        <Button onClick={addLinosNetwork}>Ajouter Linos network à Metamask</Button>
        <MetaMaskLoginBtn />
      </FullWithHeightFlex>
    );
  }

  if (networkID !== 9999337) {
    return (
      <FullWithHeightFlex>
        <Title>Switch to Linos Network</Title>
        <Button onClick={addLinosNetwork}>Switch Network</Button>
      </FullWithHeightFlex>
    );
  }

  return (
    <LinosContextProvider>
      <Routes />
    </LinosContextProvider>
  )
}
