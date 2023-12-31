import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Container,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    Button,
    Alert,
    AlertTitle
} from '@mui/material';
import axios from 'axios';
import { FileUpload } from '@mui/icons-material';
import UploadModal from '../components/UploadModal';
import Notification from '../components/Notification';
import ImageDeleteModal from '../components/ImageDeleteModal';
import { useAuth } from '../context/AuthContext';
import { AuthVerifyRefresh } from '../context/AuthVerifyRefresh';
const apiUrl = process.env.REACT_APP_API_URL;
const ImageListView = () => {
    const [loading, setLoading] = useState(false);
    const [imageData, setImageData] = useState([]);
    const [open, setOpen] = useState(null);
    const [openDelete, setOpenDelete] = useState(null);
    const [deleteData, setDeleteData] = useState([]);
    const { user, loadingState } = useAuth();
    const verifyToken = AuthVerifyRefresh();
    useEffect(() => {
        if (loadingState) return;
        const fetchData = () => {
            verifyToken().then((token) => {
                setLoading(true);
                axios
                    .get(`${apiUrl}/api/user/${user}/image`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: '*/*',
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .then((response) => {
                        setImageData(response.data);
                    })
                    .catch((error) => {
                        if (error.response?.status === 403) {
                            const message = error.response
                                ? error.response.data.detail
                                : 'Unexpected error';
                            Notification(message, 'Error', 'error', 3000);
                        } else {
                            const message = error.response
                                ? error.response.data.message
                                : 'Unexpected error';
                            Notification(message, 'Error', 'error', 3000);
                        }
                    });
                setLoading(false);
            });
        };
        fetchData();
    }, [loadingState]);
    const openModal = () => {
        setOpen(true);
    };
    const closeUploadModal = () => {
        setOpen(false);
    };
    const updateImageList = (newImageData) => {
        setImageData([...imageData, newImageData]);
    };
    const openDeleteModal = (value) => {
        setOpenDelete(true);
        setDeleteData(imageData.filter((item) => item.id === value)[0]);
    };
    const closeDeleteModal = () => {
        setOpenDelete(false);
    };
    const deleteImageList = (value) => {
        setImageData(imageData.filter((item) => item.id !== value));
    };
    return (
        <Container maxWidth="md">
            <UploadModal open={open} onClose={closeUploadModal} updateImageList={updateImageList} />
            <ImageDeleteModal
                open={openDelete}
                data={deleteData}
                onClose={closeDeleteModal}
                deleteImageList={deleteImageList}
            />
            <Card>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div" align="center">
                        Image list
                    </Typography>
                </CardContent>
                <hr />
                <CardContent>
                    <Button
                        fullWidth
                        color="primary"
                        onClick={openModal}
                        disabled={loading}
                        loading={loading.toString()}
                        startIcon={<FileUpload />}
                        variant="outlined">
                        Upload image
                    </Button>
                    {imageData.length === 0 ? (
                        <Alert severity="info" sx={{ mt: 3 }}>
                            <AlertTitle>No images available</AlertTitle>
                            There are no images to display.
                        </Alert>
                    ) : (
                        <ImageList cols={2} gap={8}>
                            {imageData.map((item) => (
                                <ImageListItem
                                    key={item.id}
                                    onClick={() => openDeleteModal(item.id)}>
                                    <img
                                        src={`${apiUrl}/${item.path}`}
                                        alt={item.name}
                                        loading="lazy"
                                    />
                                    <ImageListItemBar
                                        title={item.name}
                                        subtitle={`Uploaded on: ${item.upload_date}`}
                                        position="below"
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
};

export default ImageListView;
