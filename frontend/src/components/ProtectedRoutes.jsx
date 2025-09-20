import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import axios from 'axios';
import { Navigate } from 'react-router-dom';

function ProtectedRoutes({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    function isTokenExpired(token) {
        try {
            if (!token) return true;
            
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decoded.exp < currentTime;
        } catch (err) {
            console.log('Token decode error:', err);
            return true;
        }
    }

    const refreshAccessToken = async () => {
        try {
            const response = await axios.post(
                'http://localhost:3000/api/auth/newAccessToken', 
                {}, 
                {
                    withCredentials: true
                }
            );

            const newAccessToken = response.data.data.accessToken;
            localStorage.setItem('accessToken', newAccessToken);
            
            return newAccessToken;
        } catch (error) {
            console.error('Token refresh failed:', error);
            localStorage.removeItem('accessToken');
            throw error;
        }
    };

    const validateAuthentication = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');

            if (!accessToken) {
                console.log('No access token found, trying to refresh...');
                try {
                    await refreshAccessToken();
                    setIsAuthenticated(true);
                    return;
                } catch (error) {
                    console.log('Refresh failed, user not authenticated');
                    setIsAuthenticated(false);
                    return;
                }
            }

            if (isTokenExpired(accessToken)) {
                console.log('Access token expired, trying to refresh...');
                try {
                    await refreshAccessToken();
                    setIsAuthenticated(true);
                    return;
                } catch (error) {
                    console.log('Refresh failed, user not authenticated');
                    setIsAuthenticated(false);
                    return;
                }
            }

            console.log('Access token is valid');
            setIsAuthenticated(true);

        } catch (error) {
            console.error('Authentication validation failed:', error);
            localStorage.removeItem('accessToken');
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        validateAuthentication();
    }, []);

    if (isLoading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                fontSize: '18px'
            }}>
                <div>Checking authentication...</div>
            </div>
        );
    }

    console.log('I am in protected route, here is the isAuthenticated value', isAuthenticated)
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoutes;