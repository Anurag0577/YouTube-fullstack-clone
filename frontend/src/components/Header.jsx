import { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode' // Fixed import
import Button from './Button.jsx'
import { useNavigate } from 'react-router-dom'
import { AiOutlinePlus } from 'react-icons/ai'
import { IoMdNotificationsOutline } from 'react-icons/io';
import YouTubeLogo from '../assets/YouTube-Logo.png';

function Header() {
    const [username, setUsername] = useState('');
    const [isUserLogin, setIsUserLogin] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            try {
                const decodedToken = jwtDecode(accessToken);
                
                // Check if token is expired
                const currentTime = Date.now() / 1000;
                if (decodedToken.exp && decodedToken.exp < currentTime) {
                    // Token expired
                    localStorage.removeItem('accessToken');
                    setIsUserLogin(false);
                    setUsername('');
                    return;
                }

                if (decodedToken && decodedToken.username) {
                    setIsUserLogin(true);
                    setUsername(decodedToken.username);
                } else {
                    setIsUserLogin(false);
                    setUsername('');
                }
            } catch (error) {
                console.error('Token decode error:', error);
                // Invalid token, remove it
                localStorage.removeItem('accessToken');
                setIsUserLogin(false);
                setUsername('');
            }
        } else {
            setIsUserLogin(false);
            setUsername('');
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        setIsUserLogin(false);
        setUsername('');
    };

    return (
        <div className="headerContainer flex w-full items-center justify-between px-4 py-2">
            {/* Left side - Logo */}
            <div className="flex items-center">
                <img 
                    className="h-16 cursor-pointer" 
                    src={YouTubeLogo} 
                    alt="YouTube Logo"
                    
                />
            </div>

            {/* Right side - User actions */}
            <div className="flex items-center gap-2 w-40 justify-around">
                {true ? (
                    <>
                        <Button 
                            className="btn-primary min-h-3.5 pt-1.5 pr-3 pb-1.5 pl-3 rounded-2xl bg-gray-200 flex"
                            text="Create" 
                        />
                        <Button 
                            className='w-8 h-8 flex items-center justify-center'
                            icon={<IoMdNotificationsOutline size={28} />}
                        />
                        <div className='rounded-full w-8 h-8 border-black border-2 '>
                            <img 
                                className="object-cover w-full h-full rounded-full" 
                                src='https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?cs=srgb&dl=pexels-olly-3763188.jpg&fm=jpg'
                                alt="Profile"
                            />
                        </div>
                    
                    </>
                ) : (
                    <Button 
                        text="Login" 
                        
                    />
                )}
            </div>
        </div>
    );
}

export default Header;