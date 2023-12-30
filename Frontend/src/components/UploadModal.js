import React, { useState } from 'react';
import { Box, Modal, Typography, TextField, IconButton } from '@mui/material/';
import LoadingButton from '@mui/lab/LoadingButton';
import { MuiFileInput } from 'mui-file-input';
import { UploadFile, Close } from '@mui/icons-material';
import axios from 'axios';
import AuthProvider from '../context/AuthProvider';
import Notification from '../components/Notification';

export default function UploadModal({ open, onClose, updateImageList }) {
    const [localOpen, setLocalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        image: null
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value
        });
    };
    const handleImageChange = (value) => {
        setFormData({
            ...formData,
            image: value
        });
    };
    const removeEmptyValues = (data) => {
        const newData = {};
        for (const key in data) {
            if (data[key] !== '' && data[key] !== null) {
                newData[key] = data[key];
            }
        }
        return newData;
    };
    const convertImageToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };
    const handleSubmit = async () => {
        const result = await AuthProvider.getCurrentUser();
        if (result) {
            setErrors({});
            setLoading(true);
            const cleanedFormData = removeEmptyValues(formData);
            if (cleanedFormData['image']) {
                const img = await convertImageToBase64(cleanedFormData['image']);
                cleanedFormData['image'] = img;
            }

            await axios
                .post(`http://127.0.0.1:8000/api/user/${result}/image`, cleanedFormData, {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: '*/*',
                        Authorization: `Bearer ${AuthProvider.getAccessToken()}`
                    }
                })
                .then((response) => {
                    console.log(response);
                    updateImageList(response.data);
                    const message = response.data.message;
                    Notification(message, 'Success', 'success', 3000);
                    handleClose();
                })
                .catch((error) => {
                    if (error.response?.status === 422 || error.response?.status === 400) {
                        setTimeout(() => {
                            setErrors(error.response.data);
                        }, 500);
                    } else if (error.response?.status === 401) {
                        const message = error.response
                            ? error.response.data.errors
                            : 'Unexpected error';
                        Notification(message, 'Error', 'error', 3000);
                        handleClose();
                    } else {
                        const message = error.response
                            ? error.response.data.message
                            : 'Unexpected error';
                        Notification(message, 'Error', 'error', 3000);
                        handleClose();
                    }
                });
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }
    };
    const handleClose = () => {
        setFormData({ name: '', image: null });
        setLocalOpen(false);
        setErrors({});
        if (onClose) {
            onClose();
        }
    };

    React.useEffect(() => {
        setLoading(false);
        setErrors({});
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
                        Image upload
                    </Typography>
                    <hr />
                    <TextField
                        id="name"
                        label="Image name"
                        fullWidth
                        variant="filled"
                        sx={{ mb: 1 }}
                        value={formData.name}
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                        onChange={handleChange}
                    />
                    <MuiFileInput
                        fullWidth
                        variant="filled"
                        placeholder="Insert a file"
                        sx={{ mb: 1 }}
                        InputProps={{
                            inputProps: {
                                accept: 'image/png, image/jpeg'
                            }
                        }}
                        value={formData.image}
                        error={Boolean(errors.image)}
                        helperText={errors.image}
                        onChange={handleImageChange}
                    />
                    <LoadingButton
                        fullWidth
                        color="primary"
                        onClick={handleSubmit}
                        disabled={loading}
                        loading={loading}
                        loadingPosition="start"
                        startIcon={<UploadFile />}
                        variant="outlined">
                        Upload
                    </LoadingButton>
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
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
};
