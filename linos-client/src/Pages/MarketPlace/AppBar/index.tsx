import { AppBar as MaterialAppBar, Box, Button, Chip, Container, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';

import Tooltip from '@mui/material/Tooltip';

import React from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { useNavigate } from 'react-router-dom';
import DarkModeSwitch from '../../../components/DarkModeSwitch';
import useCurrentAccount from '../../../hooks/useCurrentAccount';
import { useLinosContext } from '../../../contexts/Linos/Context';
import useCurrentUser from '../../../hooks/useCurrentUser';


function AccountChip({ address, onClick }: { address: string, onClick?: (e: any) => any }) {
    return (
        <Chip
            avatar={<Jazzicon diameter={20} seed={jsNumberForAddress(address)} />}
            label={`${address.slice(0, 5)}...${address.slice(-4)}`}
            variant="outlined"
            clickable
            onClick={onClick}
            style={{paddingLeft: '10px', color: "white"}}
        />
    )
}

const pagesAll = [
  {title: 'explore', path: "/marketplace/all"},
  {title: 'drops', path: "/marketplace/drops"}
];
const pagesArtists = [
  {title: "Create NFT", path: "/artist-admin/create-nft"}
]
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export default function ResponsiveAppBar() {

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const navigate = useNavigate()
  const account = useCurrentAccount();
  const { listenTokenBalance, currentUser: { isArtist } } = useLinosContext();

  const pages = [
    ...pagesAll,
    ...(isArtist ? pagesArtists : [])
  ]

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <MaterialAppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Linos Marketplace
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map(({ title, path }) => (
                <MenuItem key={path} onClick={() => {
                  handleCloseNavMenu();
                  navigate(path);
                }}>
                  <Typography textAlign="center">{title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Linos Marketplace
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map(({ title, path }) => (
              <Button
                key={path}
                onClick={() => {
                  handleCloseNavMenu();
                  navigate(path);
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {title}
              </Button>
            ))}
          </Box>

          {account && (
          <Box sx={{ flexGrow: 0 }}>
            <Box sx={{display:  { xs: 'none', md: 'inline' }}}>
              <DarkModeSwitch />
              <Chip label={`LINOS : ${listenTokenBalance}`} style={{marginRight: '10px'}} />

            </Box>
            <AccountChip address={account} onClick={handleOpenUserMenu} />
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          )}
        </Toolbar>
      </Container>
    </MaterialAppBar>
  );
}




function AppBar({ children, title }: { children?: React.ReactNode; title: string }) {
    const account = useCurrentAccount();
    const { listenTokenBalance } = useLinosContext();

    return (
        <MaterialAppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
                <AdbIcon sx={{ display: { xs: 'flex'  }, mr: 1 }} />
                <Typography
                  variant="h5"
                  noWrap
                  component="a"
                  href=""
                  sx={{
                    mr: 2,
                    display: { xs: 'flex' },
                    flexGrow: 1,
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                >
                  {title}
                </Typography>

                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                  {["explore", "streaming"].map((page) => (
                    <Button
                      key={page}
                      onClick={console.log}
                      sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                      {page}
                    </Button>
                  ))}
                </Box>

                <div>
                    <DarkModeSwitch />
                    {account && <Chip label={`LINOS : ${listenTokenBalance}`} style={{marginRight: '10px'}} />}
                    {account && <AccountChip address={account} />}
                </div>


            </Toolbar>
          </Container>
        </MaterialAppBar>
    )
}