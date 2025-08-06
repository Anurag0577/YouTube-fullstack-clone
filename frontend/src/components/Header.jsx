import { useState, useEffect } from 'react'
import Button from './Button.jsx'
import { useNavigate } from 'react-router-dom'
import { AiOutlinePlus } from 'react-icons/ai'
import { IoMdNotificationsOutline } from 'react-icons/io';
import YouTubeLogo from '../assets/YouTube-Logo.png';
import { FiPlus } from "react-icons/fi";


function Header() {
    const [firstName, setFirstName] = useState('');
    const [avatar, setAvatar] = useState('')
    const [isUserLogin, setIsUserLogin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            try {
                // Use JSON.parse instead of jwtDecode because 'user' is a JSON object, not a JWT token
                const parsedUser = JSON.parse(user);

                if (parsedUser && parsedUser.firstName) {
                    setIsUserLogin(true);
                    setFirstName(parsedUser.firstName);
                    setAvatar(parsedUser.avatar || ''); // Provide fallback for avatar
                } else {
                    setIsUserLogin(false);
                    setFirstName('');
                    setAvatar('');
                }
            } catch (error) {
                console.error('JSON parse error:', error);
                // Invalid JSON, remove it
                localStorage.removeItem('user');
                setIsUserLogin(false);
                setFirstName('');
                setAvatar('');
            }
        } else {
            setIsUserLogin(false);
            setFirstName('');
            setAvatar(''); // Fixed: was missing quotes
        }
    }, []);

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div className="headerContainer flex w-full items-center justify-between px-4 py-2">
            {/* Left side - Logo */}
            <div className="flex items-center">
                <img 
                    className="h-6 m-1 cursor-pointer" 
                    src={YouTubeLogo} 
                    alt="YouTube Logo"
                    onClick={() => navigate('/')}
                />
            </div>

            {/* Right side - User actions */}
            <div className="flex w-[20%] items-center gap-2 justify-end">
                {isUserLogin ? (
                    <>
                        {/* <p className='pr-4 '>Hi, {firstName}</p> */}
                        <Button 
                            className="btn-primary min-h-3.5 pt-1.5 pr-3 pb-1.5 pl-3 rounded-2xl bg-gray-200 flex"
                            text="Create"
                        />
                        <Button 
                            className='w-8 h-8 flex items-center justify-center'
                            icon={<IoMdNotificationsOutline size={28} />}
                        />
                        {avatar ? (
                            <div className='rounded-full w-8 h-8 border-black border-2'>
                                <img 
                                    className="object-cover w-full h-full rounded-full" 
                                    src={avatar}
                                    alt="Profile"
                                />
                            </div>
                        ) : (
                            <div className='rounded-full w-8 h-8 border-black border-2 bg-gray-300 flex items-center justify-center'>
                                <span className="text-sm font-semibold">{firstName.charAt(0).toUpperCase()}</span>
                            </div>
                        )}
                    </>
                ) : (
                    <Button 
                        text="Login" 
                        onClick={handleLogin}
                    />
                )}
            </div>
        </div>
    );
}

export default Header;