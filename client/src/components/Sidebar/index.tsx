import { Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import Title from '../../Layout/Title';

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
                        <Title>Linos Music</Title>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton selected={false} onClick={console.log}>
                            <ListItemText
                                primary={"test btn"}
                                primaryTypographyProps={{
                                    sx: {
                                        height: '50px',
                                        lineHeight: '50px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }
                                }}
                            />
                        </ListItemButton>
                    </ListItem>

                </List>
        </Drawer>
    )
}