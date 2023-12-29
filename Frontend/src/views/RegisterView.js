import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Card, CardActions, CardContent, Typography, Container, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        password_confirmation: ''
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
            .post('http://127.0.0.1:8000/api/register', cleanedFormData)
            .then((response) => {
                const message = response.data.message;
                enqueueSnackbar(
                    <div>
                        <b>Success</b>
                        <br />
                        {message}
                    </div>,
                    {
                        autoHideDuration: 3000,
                        variant: 'success',
                        anchorOrigin: { horizontal: 'center', vertical: 'bottom' }
                    }
                );
                navigate('/login');
            })
            .catch((error) => {
                if (error.response && error.response.status === 422) {
                    setTimeout(() => {
                        setErrors(error.response.data);
                    }, 500);
                } else {
                    const message = error.response
                        ? error.response.data.message
                        : 'Unexpected error';
                    enqueueSnackbar(
                        <div>
                            <b>Error</b>
                            <br />
                            {message}
                        </div>,
                        {
                            autoHideDuration: 3000,
                            variant: 'error',
                            anchorOrigin: { horizontal: 'center', vertical: 'bottom' }
                        }
                    );
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
                        Registration
                    </Typography>
                </CardContent>
                <CardContent onChange={handleChange}>
                    <TextField
                        id="name"
                        label="Name"
                        fullWidth
                        variant="filled"
                        sx={{ mb: 1 }}
                        value={formData.name}
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                    />
                    <TextField
                        id="surname"
                        label="Surname"
                        fullWidth
                        variant="filled"
                        sx={{ mb: 1 }}
                        value={formData.surname}
                        error={Boolean(errors.surname)}
                        helperText={errors.surname}
                    />
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
                    <TextField
                        id="password_confirmation"
                        label="Password confirmation"
                        type="password"
                        fullWidth
                        variant="filled"
                        sx={{ mb: 1 }}
                        value={formData.password_confirmation}
                        error={Boolean(errors.password_confirmation)}
                        helperText={errors.password_confirmation}
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
                        Make new account
                    </LoadingButton>
                </CardActions>
            </Card>
        </Container>
    );
};

export default Register;
