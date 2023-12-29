import * as React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem } from '@mui/material';
import * as Icon from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

export default function NavBar({ handleDrawer }) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
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
                        <MenuItem onClick={handleClose} component={RouterLink} to="/login">
                            Login
                        </MenuItem>
                        <MenuItem onClick={handleClose} component={RouterLink} to="/register">
                            Register
                        </MenuItem>
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    );
}
