import * as React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem } from '@mui/material';
import * as Icon from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Notification from '../components/Notification';
export default function NavBar({ handleDrawer }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { isLoggedIn, login } = useAuth();
    const navigate = useNavigate();
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        navigate('/');
        Notification('Disconnected successfully', 'Success', 'success', 3000);
        login();
        handleClose();
    };

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleDrawer}
                    sx={{ mr: 2 }}>
                    <Icon.Menu />
                </IconButton>
                <Typography
                    variant="h6"
                    component="div"
                    to="/"
                    onClick={handleClose}
                    sx={{ flexGrow: 1 }}>
                    <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div onClick={handleClose}>3D avatar generator</div>
                    </RouterLink>
                </Typography>

                <div>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit">
                        <Icon.AccountCircle />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}>
                        {isLoggedIn
                            ? [
                                  <MenuItem key="logout" onClick={handleLogout}>
                                      Logout
                                  </MenuItem>
                              ]
                            : [
                                  <MenuItem
                                      key="login"
                                      onClick={handleClose}
                                      component={RouterLink}
                                      to="/login">
                                      Login
                                  </MenuItem>,
                                  <MenuItem
                                      key="register"
                                      onClick={handleClose}
                                      component={RouterLink}
                                      to="/register">
                                      Register
                                  </MenuItem>
                              ]}
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    );
}
