import loginImage from '../assets/login-img.jpg';
import Button from './Button';
import YouTubeLogo from '../assets/YouTube-Logo.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleLogin() {
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Fixed typo: was 'Context-Type'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            console.log('Login successful:', data);
            
            // Store both tokens
            if (data.data.accessToken) {
                localStorage.setItem('accessToken', data.data.accessToken);
            }

            // Store user data
            localStorage.setItem('user', JSON.stringify({
                userId: data.data.userId,
                username: data.data.username,
                email: data.data.email,
                firstName: data.data.firstName,
                lastName: data.data.lastName,
                avatar: data.data.avatar
            }));

            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="page-container h-screen w-screen flex p-7 gap-7">
                <div className="left-form h-full p-7 flex justify-center items-center border-2 border-gray-300 rounded-2xl">
                    <div className='login-form flex flex-col justify-between items-center w-full h-[60%] p-1'>
                        <div className='bold text-left black flex flex-col justify-center items-start'>
                            <img 
                                className="h-7 m-1 cursor-pointer" 
                                src={YouTubeLogo} 
                                alt="YouTube Logo"
                            />
                            <h1 className='text-3xl font-medium tracking-tighter'>Login to your account</h1>
                            <p>Enter your email below to login to your account.</p>
                        </div>
                        
                        <div className='flex flex-col mt-3 w-full'>
                            {error && (
                                <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
                                    {error}
                                </div>
                            )}
                            
                            <label className='text-lg text-left w-full' htmlFor='email'>Email</label>
                            <input 
                                id='email'
                                type='email'
                                className='email w-full border-2 border-gray-300 rounded p-2 mt-1 mb-2' 
                                placeholder='john@email.com' 
                                value={email} 
                                onChange={e => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        
                            <label className='text-left text-lg' htmlFor='password'>Password</label>
                            <input 
                                id='password'
                                type='password'
                                className='password w-full border-2 border-gray-300 rounded p-2 mt-1 mb-2' 
                                placeholder='Password' 
                                value={password} 
                                onChange={e => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        
                        <div className='w-full'>
                            <Button 
                                text={loading ? "Logging in..." : "Login"} 
                                className='w-full pt-2 pr-3 pb-2 pl-3 cursor-pointer bg-black text-white text-center mt-6 rounded disabled:opacity-50' 
                                onClick={handleLogin}
                                disabled={loading}
                            />
                            <p className='text-center w-full pt-0.5'>
                                Don't have account? 
                                <span>
                                    <button 
                                        className='underline ml-1 cursor-pointer' 
                                        onClick={() => navigate('/signup')}
                                        disabled={loading}
                                    >
                                        Create an account
                                    </button>
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="right-image h-full w-2/3">
                    <img src={loginImage} alt="Login" className='object-cover h-full w-full rounded-2xl' />
                </div>
            </div>
        </>
    );
}

export default Login;