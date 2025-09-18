import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import axios from 'axios';
import { useEffect } from "react";


function ProtectedRoutes(){

    // const [isAuthenticated, setIsAuthenticated] = useState(false)

    /* 
    1. get the accessToken from the localStorage.get('accessToken')
    2. if(accessTokenExpired){
            // check for the refresh token
            if(refreshTokenExpired){
                // redirect to login page..
            } else {
                a) send the get request to backend with the refreshToken.
                b) backend generate and give accessToken as a response
            }
        } else {
            // every thing work normally    
        }
    
    */
    function isTokenExpired(token){
        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            return decoded.exp < currentTime

        } catch (err) {
            console.log(err);
            return true;
        }
    } 


    const accessToken = localStorage.getItem('accessToken');
    const isAccessTokenExpired = isTokenExpired(accessToken);

    if(isAccessTokenExpired){
        const Token = async() => {
            const response = await axios.get('http://localhost:3000/api/auth/newAccessToken', {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const accessToken = response.data.data;
            localStorage.setItem('accessToken', accessToken)
        }
    }
    return;
}

export default ProtectedRoutes