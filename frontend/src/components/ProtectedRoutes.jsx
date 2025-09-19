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
            // Use POST method and send refresh token in body or use cookies
            const response = await axios.post('http://localhost:3000/api/auth/refresh', {
                refreshToken: localStorage.getItem('refreshToken') // If using localStorage
            }, {
                withCredentials: true // If using cookies
            });

            const newAccessToken = response.data.data.accessToken;
            
            // Store new access token
            localStorage.setItem('accessToken', newAccessToken);
            
            // If backend sends new refresh token, store it too
            if (response.data.data.refreshToken) {
                localStorage.setItem('refreshToken', response.data.data.refreshToken);
            }
            
            return newAccessToken;
        } catch (error) {
            console.error('Token refresh failed:', error);
            throw error;
        }
    };

    const validateAuthentication = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');

            // If no tokens at all, user is not authenticated
            if (!accessToken && !refreshToken) {
                setIsAuthenticated(false);
                return;
            }

            // If access token exists and is not expired, user is authenticated
            if (accessToken && !isTokenExpired(accessToken)) {
                setIsAuthenticated(true);
                return;
            }

            // Access token is expired, check refresh token
            if (!refreshToken) {
                console.log('No refresh token available');
                setIsAuthenticated(false);
                return;
            }

            // Check if refresh token is expired
            if (isTokenExpired(refreshToken)) {
                console.log('Refresh token is also expired');
                // Clear expired tokens
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                setIsAuthenticated(false);
                return;
            }

            // Refresh token is valid, try to get new access token
            console.log('Access token expired, refreshing...');
            await refreshAccessToken();
            setIsAuthenticated(true);

        } catch (error) {
            console.error('Authentication validation failed:', error);
            
            // Clear tokens on error
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Run authentication check only once when component mounts
    useEffect(() => {
        validateAuthentication();
    }, []); // Empty dependency array - runs only once

    // Show loading while checking authentication
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

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Render protected content
    return children;
}

export default ProtectedRoutes;