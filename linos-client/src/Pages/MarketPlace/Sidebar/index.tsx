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
                    <NavLink title={"All Nfts"} to={"/marketplace/all"} />
                    <NavLink title={"Your listings"} to={"/marketplace/your-listings"} />

                </List>
        </Drawer>
    )
}