import React, { useEffect, useState } from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar
} from '@mui/material';
import { grey } from '@mui/material/colors';
import AuthProvider from '../context/AuthProvider';
import { Link as RouterLink } from 'react-router-dom';
import {
    Login as LoginIcon,
    AppRegistration as AppRegistrationIcon,
    Collections,
    ThreeDRotation
} from '@mui/icons-material';
const drawerWidth = 240;

export default function DrawerMenu({ open }) {
    const [userId, setUserid] = useState(null);
    useEffect(() => {
        const fetchUserId = async () => {
            const result = await AuthProvider.getCurrentUser();
            setUserid(result);
        };
        fetchUserId();
    });
    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    backgroundColor: grey[900]
                }
            }}
            variant="persistent"
            anchor="left"
            open={open}>
            <Toolbar />
            <List>
                {userId ? (
                    <>
                        <ListItem key="image_list" disablePadding>
                            <ListItemButton component={RouterLink} to="/image_list">
                                <ListItemIcon>
                                    <Collections />
                                </ListItemIcon>
                                <ListItemText primary="Image list" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key="project_list" disablePadding>
                            <ListItemButton component={RouterLink} to="/project_list">
                                <ListItemIcon>
                                    <ThreeDRotation />
                                </ListItemIcon>
                                <ListItemText primary="Project list" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key="scene" disablePadding>
                            <ListItemButton component={RouterLink} to="/scene">
                                <ListItemIcon>
                                    <ThreeDRotation />
                                </ListItemIcon>
                                <ListItemText primary="Scene" />
                            </ListItemButton>
                        </ListItem>
                    </>
                ) : (
                    <>
                        <ListItem key="login" disablePadding>
                            <ListItemButton component={RouterLink} to="/login">
                                <ListItemIcon>
                                    <LoginIcon />
                                </ListItemIcon>
                                <ListItemText primary="Login" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key="register" disablePadding>
                            <ListItemButton component={RouterLink} to="/register">
                                <ListItemIcon>
                                    <AppRegistrationIcon />
                                </ListItemIcon>
                                <ListItemText primary="Register" />
                            </ListItemButton>
                        </ListItem>
                    </>
                )}
            </List>
        </Drawer>
    );
}
