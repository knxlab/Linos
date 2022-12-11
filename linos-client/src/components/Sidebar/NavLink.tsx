import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import * as React from "react";
import { NavLink as BaseNavLink } from "react-router-dom";

export default function NavLink({ activeClassName, activeStyle, title, to, ...props }: any) {
  return (
    <BaseNavLink
      to={to}
    >
      {({ isActive }) => (
        <ListItem disablePadding>
          <ListItemButton selected={isActive}>
            <ListItemText
                primary={title}
                primaryTypographyProps={{
                    sx: {
                        color: "white",
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
      )}
    </BaseNavLink>
  )
}


/*
            {/* <ListItemText
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
*/