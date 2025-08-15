import { useState, useEffect } from 'react'
import Button from './Button.jsx'
import { useNavigate } from 'react-router-dom'
import { AiOutlinePlus } from 'react-icons/ai'
import { TbLogout } from 'react-icons/tb';
import { IoMdNotificationsOutline } from 'react-icons/io';
import YouTubeLogo from '../assets/YouTube-Logo.png';
import { FiPlus } from "react-icons/fi";
import { FiSettings } from 'react-icons/fi';
import { TbReportAnalytics } from 'react-icons/tb';


function Header() {
    const [firstName, setFirstName] = useState('');
    const [username, setUsername] = useState('');

    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [avatar, setAvatar] = useState('')
    const [isUserLogin, setIsUserLogin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            try {
                // Use JSON.parse instead of jwtDecode because 'user' is a JSON object, not a JWT token
                const parsedUser = JSON.parse(user);
                console.log(parsedUser)

                if (parsedUser && parsedUser.firstName) {
                    setIsUserLogin(true);
                    setFirstName(parsedUser.firstName);
                    setUsername(parsedUser.username || ''); // Add username
                    setAvatar(parsedUser.avatar || ''); // Provide fallback for avatar
                } else {
                    setIsUserLogin(false);
                    setFirstName('');
                    setUsername('');
                    setAvatar('');
                }
            } catch (error) {
                console.error('JSON parse error:', error);
                // Invalid JSON, remove it
                localStorage.removeItem('user');
                setIsUserLogin(false);
                setFirstName('');
                setUsername('');
                setAvatar('');
            }
        } else {
            setIsUserLogin(false);
            setFirstName('');
            setUsername('');
            setAvatar(''); // Fixed: was missing quotes
        }
    }, []);

    
    function logoutAccount(){
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user')
        setIsUserLogin(false);
    }
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
                        <div 
                            className="relative cursor-pointer"
                            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                            >
                            {avatar ? (
                                <div className="rounded-full w-8 h-8 border-black border-2">
                                <img 
                                    className="object-cover w-full h-full rounded-full" 
                                    src={avatar}
                                    alt="Profile"
                                />
                                </div>
                            ) : (
                                <div className="rounded-full w-8 h-8 border-black border-1 bg-pink-700 text-white flex items-center justify-center">
                                <span className="text-sm font-semibold">{firstName.charAt(0).toUpperCase()}</span>
                                </div>
                            )}

                            {isProfileDropdownOpen && (
                                <div className="absolute right-0 mt-2 p-4 w-[230px] bg-white border border-gray-300 rounded-md shadow-lg text-black flex flex-col z-5000">
                                    <div className="profileDetail h-[30%] w-full flex mb-3 ">
                                        
                                            {avatar ? (
                                                <div className="rounded-full w-10 h-10 mt-1.5 border-black border-2">
                                                <img 
                                                    className="object-cover w-full h-full rounded-full" 
                                                    src={avatar}
                                                    alt="Profile"
                                                />
                                                </div>
                                            ) : (
                                                <div className="rounded-full w-10 h-10 mt-1.5 border-black border-1 bg-pink-700 text-white flex items-center justify-center">
                                                <span className="text-lg font-semibold">{firstName.charAt(0).toUpperCase()}</span>
                                                </div>
                                            )}
                                            <div className='ml-2 w-fit'>
                                                <h1 className='text-xl font-medium capitalize'>{firstName}</h1>
                                                <h1 className='text-xs text-gray-700'>@{username}</h1>
                                            </div>
                                    </div>
                                    <div className=' flex' onClick={logoutAccount} ><TbLogout className='mt-0.5 mr-1.5 text-xl' /> Log Out</div>
                                    <div className='flex mt-3'><FiSettings className='mt-0.5 mr-1.5 text-xl' />Settings</div>
                                    <div className='flex mt-3' onClick={() => navigate('/channel-dashboard')} ><TbReportAnalytics className='mt-0.5 mr-1.5 text-xl' />Channel Dashboard</div>

                                </div>
                            )}
                            </div>
                        
                    </>
                ) : (
                    <Button 
                         className='btn-primary min-h-3.5 pt-1.5 pr-4 pb-1.5 pl-4 rounded-2xl bg-gray-200 flex'
                        text="Login" 
                        onClick={handleLogin}
                    />
                )}
            </div>
        </div>
    );
}

export default Header;