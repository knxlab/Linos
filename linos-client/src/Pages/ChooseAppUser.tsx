import { Box, Button, Container, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";

import AppBar from "../components/AppBar";
import FaucetListenToken from "../components/Faucet/ListenToken";
import Styles from './ChooseApp.module.css';
import Faucet from "./LoginRegister/Faucet";

export default function ChooseAppUser() {

  const navigate = useNavigate();
  return (
    <Box id="App" sx={{ display: 'flex' }}>

        <Box component="main"
            sx={{
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
                position: 'relative',
            }}
        >
          <AppBar title={"Welcome to Linos"} />
          <Toolbar />

          <Container className={Styles.container}>
            <div className={Styles.container} style={{paddingTop: "20px"}}>
               <div>
                <Faucet />
              </div>
              <div>
                <FaucetListenToken />
              </div>
              <div>
                <Button variant="contained" onClick={() => navigate('/marketplace/all')}>Go to the marketplace</Button>
              </div>
              <div>
                <Button variant="contained" onClick={() => navigate('/streaming')}>Go to the Streaming platform</Button>
              </div>
            </div>
          </Container>
        </Box>
    </Box>
  );
}