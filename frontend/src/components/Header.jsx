import { useState, useEffect } from 'react';
import Button from './Button.jsx';
import { useNavigate } from 'react-router-dom';
import { AiOutlinePlus } from 'react-icons/ai';
import { TbLogout } from 'react-icons/tb';
import { IoMdNotificationsOutline } from 'react-icons/io';
import YouTubeLogo from '../assets/YouTube-Logo.png';
import { FiPlus } from 'react-icons/fi';
import { FiSettings } from 'react-icons/fi';
import { TbReportAnalytics } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import { show } from '../slice/createVideoPopupShow.js';
import { FaBars } from 'react-icons/fa6';
import { showSidebar, hideSidebar } from '../slice/sidebarHandler.js';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axios.js';

function Header() {
  const [firstName, setFirstName] = useState('');
  const [username, setUsername] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [avatar, setAvatar] = useState('');
  const [isUserLogin, setIsUserLogin] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentSidebarState = useSelector(state => state.sidebarHandler.value)

  useEffect(() => {
    const user = localStorage.getItem('user');
    const currentTime = new Date().getTime();
    let token = localStorage.getItem('accessToken');
    const decodedToken = token ? jwtDecode(token) : null;
    const tokenExpiry = decodedToken ? decodedToken.exp * 1000 : null;
    if (tokenExpiry && currentTime > tokenExpiry) {
      // Token has expired
      localStorage.removeItem('accessToken');
    }
    if (user) {
      try {
        const parsedUser = JSON.parse(user);

        if (parsedUser && parsedUser.firstName) {
          setIsUserLogin(true);
          setFirstName(parsedUser.firstName);
          setUsername(parsedUser.username || '');
          setAvatar(parsedUser.avatar || '');
        } else {
          setIsUserLogin(false);
          setFirstName('');
          setUsername('');
          setAvatar('');
        }
      } catch (error) {
        console.error('JSON parse error:', error);
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
      setAvatar('');
    }
  }, []);

  function createVideo() {
    navigate('/channel-dashboard');
    dispatch(show());
  }

  async function logoutAccount() {
    try {
      // Call the logout API endpoint
      const response = await api.post('/auth/logout', {}, 
        // method: 'POST',
        // credentials: 'include', // CRITICAL: Send cookies to server
        // headers: {
        //   'Content-Type': 'application/json',
        // },
        {withCredentials: true}
      );

      if (response.status === 200) {
        console.log('Logout successful');
      } else {
        console.error('Logout failed:', response.status);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear frontend storage, even if API call fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setIsUserLogin(false);
      setIsProfileDropdownOpen(false);
      // No redirect - user stays on current page
    }
  }

  const handleSidebar = () => {
    
    
    if(currentSidebarState){
        dispatch(hideSidebar())
    } else{
        dispatch(showSidebar())
    }
    console.log("currentSidebarState", currentSidebarState)
  }

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="headerContainer fixed top-0 left-0 w-full h-16 bg-white text-black flex items-center justify-between px-4 py-2 z-20">
      {/* Left side - Logo */}
      <div className="flex items-center">
      <div className="text-xl mr-1 cursor-pointer" onClick={handleSidebar}>
             <FaBars  />
      </div>
       
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
            <Button
              className="btn-primary min-h-9 cursor-pointer pt-1.5 pr-3 pb-1.5 pl-3 rounded-2xl bg-gray-200 flex"
              text="Create"
              onClick={() => createVideo()}
            />
            <Button
              className="w-8 h-8 flex items-center justify-center"
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
                <div className="absolute right-0 mt-2 p-4 w-[230px] bg-white border border-gray-300 rounded-md shadow-lg text-black flex flex-col z-30">
                  <div className="profileDetail h-[30%] w-full flex mb-3">
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
                    <div className="ml-2 w-fit">
                      <h1 className="text-xl font-medium capitalize">{firstName}</h1>
                      <h1 className="text-xs text-gray-700">@{username}</h1>
                    </div>
                  </div>
                  <div className="flex" onClick={
                    () => {
                      const isUserLogin = localStorage.getItem('accessToken');
                        if(!isUserLogin){
                          toast.info("You have to login to explore this page!!")
                        }
                      navigate('/channel-dashboard')
                    }   
                  }>
                    <FiSettings className="mt-0.5 mr-1.5 text-xl" />Channel Dashboard
                  </div>
                  <div className="flex mt-3" onClick={logoutAccount}>
                    <TbLogout className="mt-0.5 mr-1.5 text-xl" /> Log Out
                  </div>
                  <div className="flex mt-3">
                    <FiSettings className="mt-0.5 mr-1.5 text-xl" />Settings
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <Button
            className="btn-primary min-h-9 pt-1.5 pr-4 pb-1.5 pl-4 rounded-2xl bg-gray-200 flex cursor-pointer"
            text="Login"
            onClick={handleLogin}
          />
        )}
      </div>
    </div>
  );
}

export default Header;