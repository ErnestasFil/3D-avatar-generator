import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Notification from '../components/Notification';
import { useNavigate } from 'react-router-dom';
class AuthProvider {
    logout() {
        localStorage.removeItem('access-token');
        localStorage.removeItem('refresh-token');
    }
    getAccessToken() {
        return localStorage.getItem('access-token');
    }
    refreshToken = async () => {
        await axios
            .post('http://127.0.0.1:8000/api/refresh', {
                refresh: localStorage.getItem('refresh-token')
            })
            .then((response) => {
                localStorage.setItem('access-token', response?.data['access']);
            })
            .catch((error) => {
                const message = 'Please login again';
                Notification(message, 'Error', 'error', 3000);
                this.logout();
                const navigate = useNavigate();
                this.navigate('/');
            });
    };
    checkTokenIsValid = async () => {
        if (this.verificationInProgress) {
            return;
        }
        this.verificationInProgress = true;
        await axios
            .post('http://127.0.0.1:8000/api/verify', {
                token: localStorage.getItem('access-token')
            })
            .catch((error) => {
                if (error.response?.status === 401) {
                    this.refreshToken();
                } else {
                    const message = 'Please login again';
                    Notification(message, 'Error', 'error', 3000);
                    this.logout();
                }
            });
        this.verificationInProgress = false;
    };
    async getCurrentUser() {
        const accessToken = localStorage.getItem('access-token');
        if (!accessToken) {
            this.logout();
            return null;
        }
        const decoded = jwtDecode(accessToken);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
            await this.checkTokenIsValid();
        }
        return decoded.user_id;
    }
}

export default new AuthProvider();
