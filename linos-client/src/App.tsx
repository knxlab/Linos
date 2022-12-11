import { Box, Toolbar } from "@mui/material";

import "./App.css";
// eslint-disable-next-line
// @ts-ignore
import { useEth } from "./contexts/EthContext";

import { FullWithHeightFlex } from "./Layout/FullWidthHeightFlex";
import Title from "./Layout/Title";
import MetaMaskLoginBtn from "./components/MetaMaskLoginBtn";
import Routes from "./Routes";
import { LinosContextProvider } from "./contexts/Linos/Context";

export function AppLoadEth() {
  const { state: { ready }} = useEth();

  if (!ready) {
    return (
      <FullWithHeightFlex>
        <Title>Welcome to Linos</Title>
        <MetaMaskLoginBtn />
      </FullWithHeightFlex>
    );
  }

  return (
    <LinosContextProvider>
      <Routes />
    </LinosContextProvider>
  )
}
