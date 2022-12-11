import { Divider, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import NavLink from '../../../components/Sidebar/NavLink';

import Title from '../../../Layout/Title';

const drawerWidth = 240;

export default function Sidebar() {

    return (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
                <List>
                    <ListItem>
                        <Title>Linos Marketplace</Title>
                    </ListItem>
                    <NavLink title={"Create NFT Collection"} to={"/artist-admin/create-nft"} />
                    <NavLink title={"NFT Collections"} to={"/artist-admin/collections"} />
                    <NavLink title={"Maketplace listings"} to={"/artist-admin/listings"} />

                    <Divider />


                    <ListItem>
                        <Title>Linos Music</Title>
                    </ListItem>
                    <NavLink title={"Create Track"} to={"/artist-admin/create-track"} />
                    <NavLink title={"My music"} to={"/artist-admin/tracks"} />

                </List>
        </Drawer>
    )
}