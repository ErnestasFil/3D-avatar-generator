import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Notification from '../components/Notification';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const apiUrl = process.env.REACT_APP_API_URL;

export const AuthVerifyRefresh = () => {
    const navigate = useNavigate();
    const { setUser, access, setAccess, refresh, login } = useAuth();

    const checkTokenIsValid = async () => {
        try {
            await axios.post(`${apiUrl}/api/verify`, {
                token: access
            });
            return access;
        } catch (error) {
            if (error.response?.status === 401) {
                const token = await refreshToken();
                return token;
            } else {
                const message = 'Please login again';
                Notification(message, 'Error', 'error', 3000);
                login();
                navigate('/');
            }
        }
    };
    const refreshToken = async () => {
        try {
            const response = await axios.post(`${apiUrl}/api/refresh`, {
                refresh: refresh
            });
            setAccess(response?.data['access']);
            localStorage.setItem('access-token', response?.data['access']);
            const decoded = jwtDecode(response?.data['access']);
            setUser(decoded.user_id);
            return response?.data['access'];
        } catch (error) {
            const message = 'Please login again';
            Notification(message, 'Error', 'error', 3000);
            login();
            navigate('/');
        }
    };

    return checkTokenIsValid;
};
