import React, { useState } from 'react';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import { CssBaseline, Box, Container, Paper } from '@mui/material';
import NavBar from '../components/NavBar';
import DrawerMenu from '../components/Drawer';
import AppRouter from '../router';

const darkTheme = createTheme({
    palette: {
        mode: 'dark'
    }
});
const drawerWidth = 240;
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen
            }),
            marginLeft: 0
        })
    })
);

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end'
}));

function App() {
    const [open, setDrawerOpen] = useState(true);

    const handleDrawer = () => {
        setDrawerOpen(!open);
    };
    return (
        <Box sx={{ display: 'flex' }}>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <NavBar handleDrawer={handleDrawer} />
                <DrawerMenu open={open} />
                <Main open={open}>
                    <DrawerHeader />
                    <AppRouter drawerOpen={handleDrawer} open={open} />
                </Main>
            </ThemeProvider>
        </Box>
    );
}

export default App;
