import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import AppBar from "../../components/AppBar";
import Sidebar from "./Sidebar";


export default function ArtistAdmin() {
  return (
    <Box id="App" sx={{ display: 'flex' }}>

        <Sidebar />

        <Box component="main"
            sx={{
                display: 'flex',
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
                position: 'relative',
            }}
        >

          <Outlet />
        </Box>
    </Box>
  );
}