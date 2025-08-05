import loginImage from '../assets/login-img.jpg';
import Button from './Button';
import YouTubeLogo from '../assets/YouTube-Logo.png';
import signupImage from '../assets/signup.jpg'

function SignUp() {
    return (
        <>
            <div className="page-container h-screen w-screen  flex  p-7 gap-7">
            <div className="left-image h-full w-2/3 ">
                    <img src={signupImage} alt="Login" className='object-cover h-full w-full rounded-2xl ' />
                </div>

                <div className="right-form h-full w-1/3 p-7 flex justify-center items-center border-2 border-gray-300 rounded-2xl ">
                    <div className='login-form flex flex-col justify-between items-center w-full h-[100%]  p-1'>
                        <div className='bold  text-center black flex flex-col justify-center items-center'>
                        <img 
                            className="h-16 cursor-pointer" 
                            src={YouTubeLogo} 
                            alt="YouTube Logo"
                            
                        />
                            <h1 className='text-4xl font-bold'>Sign up with email</h1>
                            <p >Enter your email and password to register.</p>
                        </div>
                        
                        <div className='flex flex-col mt-3 w-full'>
                        <div className='flex gap-2'>
                            <div>
                            <label className=' text-left text-lg' htmlFor='firstname'>First Name</label>
                            <input className='firstname w-full border-2 border-gray-300 rounded p-2 mt-1 mb-2' placeholder='John'></input>
                            </div>
                        

                        <div>
                        <label className=' text-left text-lg' htmlFor='lastname'>Last Name</label>
                        <input className='lastname w-full border-2 border-gray-300 rounded p-2 mt-1 mb-2' placeholder='Snow'></input>
                        </div>
                        

                        </div>    

                        <label className=' text-left text-lg' htmlFor='username'>Username</label>
                        <input className='username w-full border-2 border-gray-300 rounded p-2 mt-1 mb-2' placeholder='John123'></input>

                        
                            <label className='text-lg text-left w-full' htmlFor='email'>Email</label>
                            <input className='email w-full border-2 border-gray-300 rounded p-2 mt-1 mb-2' placeholder='john@example.com'></input>
                        
                            <label className=' text-left text-lg' htmlFor='password'>Password</label>
                            <input className='password w-full border-2 border-gray-300 rounded p-2 mt-1 mb-2' placeholder='Password'></input>


                        </div>
                        <Button text="Create Account" className='w-full pt-2 pr-3 pb-2 pl-3 bg-black text-white text-center mt-6 rounded'></Button>
                    </div>
                </div>
                
            </div>
        </>
    );
}

export default SignUp;