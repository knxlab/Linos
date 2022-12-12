import { Divider, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavLink from '../../../components/Sidebar/NavLink';

import Title from '../../../Layout/Title';

const drawerWidth = 240;

export default function Sidebar() {
    const navigate = useNavigate();
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
                        <ListItemButton onClick={() => {
                            navigate("/")
                        }}>
                            <Title>Linos For Artist</Title>
                        </ListItemButton>
                    </ListItem>
                    <NavLink title={"Create NFT Collection"} to={"/artist-admin/create-nft"} />
                    {/* <NavLink title={"NFT Collections"} to={"/artist-admin/collections"} />
                    <NavLink title={"Maketplace listings"} to={"/artist-admin/listings"} /> */}

                    <Divider />

                    <NavLink title={"Track for Linos Streaming"} to={"/artist-admin/create-track"} />
                    {/* <NavLink title={"My music"} to={"/artist-admin/tracks"} /> */}

                </List>
        </Drawer>
    )
}