import { AppBar as MaterialAppBar, Chip, Toolbar, Typography } from '@mui/material';
import React from 'react';
import useCurrentAccount from '../../hooks/useCurrentAccount';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import styles from './styles.module.css';
import { useLinosContext } from '../../contexts/Linos/Context';
import DarkModeSwitch from '../DarkModeSwitch';

function AccountChip({ address }: { address: string }) {
    return (
        <Chip
            avatar={<Jazzicon diameter={20} seed={jsNumberForAddress(address)} />}
            label={`${address.slice(0, 5)}...${address.slice(-4)}`}
            variant="outlined"
            clickable
            style={{paddingLeft: '10px', color: "white"}}
        />
    )
}

export default function AppBar({ children, title }: { children?: React.ReactNode; title: string }) {
    const account = useCurrentAccount();
    const { listenTokenBalance } = useLinosContext();

    return (
        <MaterialAppBar position="absolute" sx={{ width: "100%" }}>
            <Toolbar
                sx={{
                    // pr: '24px', // keep right padding when drawer closed
                }}
            >

                <Typography
                    component="h1"
                    variant="h6"
                    color="inherit"
                    noWrap

                >
                {title}
                </Typography>

                <div className={styles.containerCenter}>
                    {children}
                </div>

                <div>
                    <DarkModeSwitch />
                    {account && <Chip label={`LINOS : ${listenTokenBalance}`} style={{marginRight: '10px'}} />}
                    {account && <AccountChip address={account} />}
                </div>


            </Toolbar>
        </MaterialAppBar>
    )
}