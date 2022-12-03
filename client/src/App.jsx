import { Box, Toolbar } from "@mui/material";

import "./App.css";
import { useEth } from "./contexts/EthContext";
import Sidebar from "./components/Sidebar";

import AppBar from "./components/AppBar";
import { FullWithHeightFlex } from "./Layout/FullWidthHeightFlex";
import Title from "./Layout/Title";
import MetaMaskLoginBtn from "./components/MetaMaskLoginBtn";


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
    <App />
  )
}

function App() {

  return (
    <Box id="App" sx={{ display: 'flex' }}>

        <Sidebar />

        <Box component="main"
            sx={{
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
                position: 'relative',
            }}
        >
          <AppBar />
          <Toolbar />
        </Box>
    </Box>
  );
}

export default App;
