import { useState } from 'react';
import loginImage from '../assets/login-img.jpg';
import Button from './Button';
import YouTubeLogo from '../assets/YouTube-Logo.png';
import signupImage from '../assets/signup.jpg'
import { useNavigate } from 'react-router-dom';

function SignUp() {
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                alert('Please select a valid image file (JPEG, PNG, or GIF)');
                return;
            }

            // Validate file size (e.g., 5MB limit)
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (file.size > maxSize) {
                alert('File size should be less than 5MB');
                return;
            }

            setSelectedAvatar(file);
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeAvatar = () => {
        setSelectedAvatar(null);
        setAvatarPreview(null);
        // Reset the file input
        const fileInput = document.getElementById('avatar-input');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            // Create FormData object to send file and other data
            const formData = new FormData();
            
            // Add form fields
            formData.append('firstName', e.target.firstname.value);
            formData.append('lastName', e.target.lastname.value);
            formData.append('username', e.target.username.value);
            formData.append('email', e.target.email.value);
            formData.append('password', e.target.password.value);
            
            // Add avatar if selected
            if (selectedAvatar) {
                formData.append('avatar', selectedAvatar);
            }

            // Use the correct backend API endpoint
            const response = await fetch('http://localhost:3000/api/auth/signup', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Account created successfully:', result);
                // Handle success (redirect, show message, etc.)
                alert('Account created successfully!');
                navigate('/');
                // You can redirect to login page or dashboard here
            } else {
                const errorData = await response.json();
                console.error('Error creating account:', errorData);
                alert(`Error: ${errorData.message || 'Failed to create account'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Network error. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <>
            <div className="page-container h-screen w-screen flex p-7 gap-7">
                <div className="left-image h-full w-2/3">
                    <img src={signupImage} alt="Login" className='object-cover h-full w-full rounded-2xl' />
                </div>

                <div className="right-form h-full w-1/3 p-1 flex justify-center items-center border-2 border-gray-300 rounded-2xl">
                    <div className='login-form flex flex-col justify-between items-left w-full h-[100%] p-1'>
                        <div className='bold text-left black flex flex-col justify-center items-start'>
                            <img 
                                className="h-16 cursor-pointer" 
                                src={YouTubeLogo} 
                                alt="YouTube Logo"
                            />
                            <h1 className='text-3xl font-medium tracking-tighter'>Create an account</h1>
                            <p>Enter your details below to create your account.</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className='flex flex-col mt-3 w-full'>
                            <div className='flex gap-2'>
                                <div>
                                    <label className='text-left text-lg' htmlFor='firstname'>First Name</label>
                                    <input 
                                        name="firstname"
                                        className='firstname w-full border-2 border-gray-300 rounded p-2 mt-1 mb-2' 
                                        placeholder='John'
                                        required
                                    />
                                </div>

                                <div>
                                    <label className='text-left text-lg' htmlFor='lastname'>Last Name</label>
                                    <input 
                                        name="lastname"
                                        className='lastname w-full border-2 border-gray-300 rounded p-2 mt-1 mb-2' 
                                        placeholder='Snow'
                                        required
                                    />
                                </div>
                            </div>    

                            <label className='text-left text-lg' htmlFor='username'>Username</label>
                            <input 
                                name="username"
                                className='username w-full border-2 border-gray-300 rounded p-2 mt-1 mb-2' 
                                placeholder='John123'
                                required
                            />
                            
                            <label className='text-lg text-left w-full' htmlFor='email'>Email</label>
                            <input 
                                name="email"
                                type="email"
                                className='email w-full border-2 border-gray-300 rounded p-2 mt-1 mb-2' 
                                placeholder='john@example.com'
                                required
                            />
                        
                            <label className='text-left text-lg' htmlFor='password'>Password</label>
                            <input 
                                name="password"
                                type="password"
                                className='password w-full border-2 border-gray-300 rounded p-2 mt-1 mb-2' 
                                placeholder='Password'
                                required
                            />

                            {/* Avatar Upload Section */}
                            <div className='avatar-section mt-2 mb-1'>
                                <label className='text-left text-lg block mb-2'>Profile Avatar (Optional)</label>
                                
                                {avatarPreview ? (
                                    <div className='avatar-preview-container flex items-center gap-4 p-3 border-2 border-dashed border-gray-300 rounded-lg'>
                                        <div className='avatar-preview'>
                                            <img 
                                                src={avatarPreview} 
                                                alt="Avatar preview" 
                                                className='w-16 h-16 object-cover rounded-full border-2 border-gray-300'
                                            />
                                        </div>
                                        <div className='flex-1'>
                                            <p className='text-sm text-gray-600 mb-2'>
                                                {selectedAvatar?.name}
                                            </p>
                                            <div className='flex gap-2'>
                                                <button
                                                    type="button"
                                                    onClick={() => document.getElementById('avatar-input').click()}
                                                    className='px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors'
                                                >
                                                    Change
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={removeAvatar}
                                                    className='px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors'
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div 
                                        className='avatar-upload-area border-2 border-dashed border-gray-300 rounded-lg p-2 text-center cursor-pointer hover:border-gray-400 transition-colors'
                                        onClick={() => document.getElementById('avatar-input').click()}
                                    >
                                        <div className='upload-icon mb-2'>
                                            <svg className='w-8 h-8 mx-auto text-gray-400' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </div>
                                        <p className='text-sm text-gray-600 mb-1'>Click to upload avatar</p>
                                        <p className='text-xs text-gray-400'>PNG, JPG, GIF up to 5MB</p>
                                    </div>
                                )}

                                <input
                                    id="avatar-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className='hidden'
                                />
                            </div>

                            <div>
                                <button 
                                    className='w-fullointer cursor-pointer pt-2 pr-3 pb-2 pl-3 bg-black text-white text-center mt-1 rounded disabled:opacity-50 w-full'
                                    disabled={isUploading}
                                    type="submit"
                                    >{isUploading ? "Creating Account..." : "Create Account"} </button>
                                <p className='text-center w-full pt-0.5'>
                                    Already have an account? <span><a className='underline' href="#">Login</a></span>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SignUp;