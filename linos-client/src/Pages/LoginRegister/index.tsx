import { Avatar, Box, ButtonGroup, InputAdornment } from "@mui/material";
import AppBar from "../../components/AppBar";

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { useState } from "react";
import { useLinosContext } from "../../contexts/Linos/Context";
import useCurrentAccount from "../../hooks/useCurrentAccount";


export default function LoginRegister() {

  const [type, setType] = useState<'user' | 'artist'>('user');
  const [name, setName] = useState("");
  const [artistSymbol, setArtistSymbol] = useState("");
  const { linosContract, currentUser: { refetch: refetchUser } } = useLinosContext();
  const account = useCurrentAccount();

  const registerArtist = async () => {
    if (name.trim() === "" || artistSymbol.trim() === "") {
      alert("Missing infos !");
      return;
    }
    const method = linosContract.methods.registerAsArtist(name, artistSymbol);
    try {
      await method.call({ from: account });
      const register = await method.send({ from: account });
      await refetchUser();
    } catch (e: any) {
      alert(e.message);
    }
  }

  const registerUser = async () => {
    if (name.trim() === "") {
      alert("Missing infos !");
      return;
    }
    const method = linosContract.methods.registerAsUser(name);
    try {
      await method.call({ from: account });
      const register = await method.send({ from: account });
      await refetchUser();
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <Box id="App" sx={{ display: 'flex' }}>

        <Box component="main"
            sx={{
                display: 'flex',
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
                position: 'relative',
                flexDirection: 'column',
                justifyContent: "center"
            }}
        >

          <AppBar title="Login / Register" />

          <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <ButtonGroup disableElevation variant="contained" color="primary">
            <Button color={type==='user' ?"success" : "primary"} onClick={() => setType('user')}>Listener</Button>
            <Button color={type==='artist' ?"success" : "primary"} onClick={() => setType('artist')}>Artist</Button>
          </ButtonGroup>
          <Box component="form" onSubmit={console.log} noValidate sx={{ mt: 1, width: '50%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={type === 'user' ? "Your name" : "Your artist name"}
              name="name"
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            {type === 'artist' && (
            <TextField
              margin="normal"
              required
              fullWidth
              label={"Symbol for your Token"}
              InputProps={{
               startAdornment: <InputAdornment position="start">L-</InputAdornment>
              }}
              value={artistSymbol}
              onChange={(e) => {
                setArtistSymbol(e.target.value);
              }}
            />
            )}
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={type === 'artist' ? registerArtist: registerUser}
            >
              Sign In
            </Button>
          </Box>
        </Box>
        </Box>
    </Box>
  );
}