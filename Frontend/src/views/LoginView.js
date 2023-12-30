import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Card, CardActions, CardContent, Typography, Container, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';
import Notification from '../components/Notification';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const removeEmptyValues = (data) => {
        const newData = {};
        for (const key in data) {
            if (data[key] !== '') {
                newData[key] = data[key];
            }
        }
        return newData;
    };

    const handleSubmit = async () => {
        setErrors({});
        setLoading(true);
        const cleanedFormData = removeEmptyValues(formData);
        await axios
            .post('http://127.0.0.1:8000/api/login', cleanedFormData)
            .then((response) => {
                const message = response.data.message;
                Notification(message, 'Success', 'success', 3000);
                localStorage.setItem('access-token', response?.data['access-token']);
                localStorage.setItem('refresh-token', response?.data['refresh-token']);
                navigate('/');
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
                } else {
                    const message = error.response
                        ? error.response.data.message
                        : 'Unexpected error';
                    Notification(message, 'Error', 'error', 3000);
                }
            });
        setTimeout(() => {
            setLoading(false);
        }, 500);
    };

    return (
        <Container maxWidth="md">
            <Card>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div" align="center">
                        Sign in
                    </Typography>
                </CardContent>
                <hr />
                <CardContent onChange={handleChange}>
                    <TextField
                        id="email"
                        label="Email"
                        fullWidth
                        variant="filled"
                        sx={{ mb: 1 }}
                        value={formData.email}
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                    />
                    <TextField
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="filled"
                        sx={{ mb: 1 }}
                        value={formData.password}
                        error={Boolean(errors.password)}
                        helperText={errors.password}
                    />
                </CardContent>
                <CardActions>
                    <LoadingButton
                        fullWidth
                        color="success"
                        onClick={handleSubmit}
                        disabled={loading}
                        loading={loading}
                        loadingPosition="start"
                        startIcon={<SaveIcon />}
                        variant="outlined">
                        Login
                    </LoadingButton>
                </CardActions>
            </Card>
        </Container>
    );
};

export default Login;
