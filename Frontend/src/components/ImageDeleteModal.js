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
import { useNavigate } from 'react-router-dom';
import AuthProvider from '../context/AuthProvider';
import Notification from '../components/Notification';

export default function ImageDeleteModal({ open, data, onClose, deleteImageList }) {
    const [localOpen, setLocalOpen] = useState(false);

    const deleteImage = async () => {
        const result = await AuthProvider.getCurrentUser();
        if (result) {
            await axios
                .delete(`http://127.0.0.1:8000/api/user/${result}/image/${data.id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: '*/*',
                        Authorization: `Bearer ${AuthProvider.getAccessToken()}`
                    }
                })
                .then((response) => {
                    deleteImageList(data.id);
                    Notification('Image deleted successfully.', 'Success', 'success', 3000);
                    handleClose();
                })
                .catch((error) => {
                    console.log(error);
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
                            src={`http://127.0.0.1:8000/${data.path}`}
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
    overflowY: 'auto', // Add this line to enable vertical scrolling
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
};
