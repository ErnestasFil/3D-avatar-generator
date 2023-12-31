import React, { useState } from 'react';
import {
    Box,
    Modal,
    Typography,
    ImageListItem,
    ImageListItemBar,
    Alert,
    AlertTitle,
    IconButton,
    Button,
    Grid
} from '@mui/material/';
import { Close, Delete, CancelScheduleSend } from '@mui/icons-material';
import axios from 'axios';
import Notification from '../components/Notification';
import { useAuth } from '../context/AuthContext';
import { AuthVerifyRefresh } from '../context/AuthVerifyRefresh';
const apiUrl = process.env.REACT_APP_API_URL;

export default function ImageDeleteModal({ open, data, onClose, deleteImageList }) {
    const [localOpen, setLocalOpen] = useState(false);
    const { user, isLoggedIn } = useAuth();
    const verifyToken = AuthVerifyRefresh();
    const deleteImage = async () => {
        verifyToken().then((token) => {
            if (isLoggedIn) {
                axios
                    .delete(`${apiUrl}/api/user/${user}/image/${data.id}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: '*/*',
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .then(() => {
                        deleteImageList(data.id);
                        Notification('Image deleted successfully.', 'Success', 'success', 3000);
                        handleClose();
                    })
                    .catch((error) => {
                        if (error.response?.status === 403) {
                            const message = error.response
                                ? error.response.data.detail
                                : 'Unexpected error';
                            Notification(message, 'Error', 'error', 3000);
                            handleClose();
                        } else {
                            const message = error.response
                                ? error.response.data.message
                                : 'Error removing image.';
                            Notification(message, 'Error', 'error', 3000);
                            handleClose();
                        }
                    });
            }
        });
    };
    const handleClose = () => {
        setLocalOpen(false);
        if (onClose) {
            onClose();
        }
    };

    React.useEffect(() => {
        setLocalOpen(open || false);
    }, [open]);

    return (
        <div>
            <Modal
                open={localOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500]
                        }}>
                        <Close />
                    </IconButton>
                    <Typography gutterBottom variant="h5" component="div" align="center">
                        Image remove
                    </Typography>
                    <hr />
                    <Alert severity="warning">
                        <AlertTitle>Warning</AlertTitle>
                        Are you sure that you want to <strong>remove</strong> this photo?
                    </Alert>
                    <hr />
                    <ImageListItem key={data.id}>
                        <img
                            src={`${apiUrl}/${data.path}`}
                            alt={data.name}
                            style={{ maxHeight: '70vh' }}
                            loading="lazy"
                        />
                        <ImageListItemBar
                            title={data.name}
                            subtitle={`Uploaded on: ${data.upload_date}`}
                            position="below"
                        />
                    </ImageListItem>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="error"
                                startIcon={<Delete />}
                                onClick={deleteImage}>
                                Delete image
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="success"
                                startIcon={<CancelScheduleSend />}
                                onClick={handleClose}>
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </div>
    );
}
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 900,
    maxHeight: '80vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
};
