import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import AppBar from "../../components/AppBar";
import Sidebar from "../../components/Sidebar";


export default function MarketPlace() {
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
          <AppBar title={"Linos Marketplace"}/>
          <Toolbar />

          <Outlet />
        </Box>
    </Box>
  );
}