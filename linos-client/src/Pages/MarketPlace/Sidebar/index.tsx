import { Divider, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavLink from '../../../components/Sidebar/NavLink';

import Title from '../../../Layout/Title';

const drawerWidth = 240;

export default function Sidebar() {
    const navigate = useNavigate()
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
                        <Title>Linos Marketplace</Title>
                      </ListItemButton>
                    </ListItem>
                    <NavLink title={"All Nfts"} to={"/marketplace/all"} />
                    <NavLink title={"Your listings"} to={"/marketplace/your-listings"} />

                </List>
        </Drawer>
    )
}