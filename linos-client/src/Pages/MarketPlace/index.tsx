import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import ResponsiveAppBar from "./AppBar";


export default function MarketPlace() {
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
          <ResponsiveAppBar />
          <Outlet />
        </Box>
    </Box>
  );
}