import { SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './views/App';
import { BrowserRouter } from 'react-router-dom';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <BrowserRouter>
        <React.StrictMode>
            <SnackbarProvider maxSnack={3}>
                <App />
            </SnackbarProvider>
        </React.StrictMode>
    </BrowserRouter>
);
