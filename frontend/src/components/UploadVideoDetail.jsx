import { IoCloseCircleOutline } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { hide } from '../slice/createVideoPopupShow';
import { HiUpload } from 'react-icons/hi';
import { MdOutlineHd } from 'react-icons/md';
import { FaRegCheckCircle } from 'react-icons/fa';
import VideoDetail from './VideoDetail';
import axios from 'axios';
import Button from './Button';

function UploadVideoDetail({file}){
    const dispatch = useDispatch();
    const [progress, setProgress] = useState(0);
    const [uploadVideoDetail, setUploadVideoDetail] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    
    const steps = [
        {
            name: 'Details'
        },
        {
            name: 'Checks'
        },
        {
            name: 'Visibility'
        }
    ];

    useEffect(() => {
        const formData = new FormData();
        formData.append('video', file);

        axios.post('http://localhost:3000/api/upload/video', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
                const progressPercentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setProgress(progressPercentage);
            }
        })
        .then((res) => {
            setUploadVideoDetail(res.data);
        })
        .catch(error => {
            console.error(error);
        });
    }, [file]);

    const getStepStatus = (index) => {
        if (index < currentIndex) return 'completed';
        if (index === currentIndex) return 'active';
        return 'pending';
    };

    return (
        <div className='flex flex-col max-h-full overflow-auto h-full justify-between'>
            <div className='flex justify-between items-center max-h-[15%] border-b border-gray-200'>
                <div className='font-semibold text-xl text-gray-800 truncate pr-4'>{file.name}</div>
                <div 
                    className='text-2xl text-gray-400 hover:text-gray-600 cursor-pointer transition-colors duration-200' 
                    onClick={() => { dispatch(hide())}}
                >
                    <IoCloseCircleOutline />
                </div>
            </div>

            <div className='py-8 max-h-[20%]'>
                <div className='flex items-center justify-between relative'>
                    {steps.map((step, index) => (
                        <div key={index} className='flex flex-col items-center relative z-10'>
                            {/* Step Circle */}
                            <div 
                                className={`
                                    w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold
                                    transition-all duration-300 ease-in-out transform
                                    ${getStepStatus(index) === 'completed' 
                                        ? 'bg-green-500 text-white scale-110' 
                                        : getStepStatus(index) === 'active'
                                        ? 'bg-black text-white scale-110 shadow-lg shadow-blue-500/30'
                                        : 'bg-gray-200 text-gray-500'
                                    }
                                `}
                            >
                                {getStepStatus(index) === 'completed' ? (
                                    <FaRegCheckCircle className="w-5 h-5" />
                                ) : (
                                    <span>{index + 1}</span>
                                )}
                            </div>
                            
                            {/* Step Label */}
                            <div 
                                className={`
                                    mt-3 text-sm font-medium transition-colors duration-300
                                    ${getStepStatus(index) === 'active' 
                                        ? 'text-black' 
                                        : getStepStatus(index) === 'completed'
                                        ? 'text-green-600'
                                        : 'text-gray-500'
                                    }
                                `}
                            >
                                {step.name}
                            </div>
                        </div>
                    ))}

                    {/* Progress Bar Background */}
                    <div className='absolute top-[14px] left-6 right-6 h-0.5 bg-gray-200 -z-0'></div>
                    
                    {/* Progress Bar Fill */}
                    <div 
                        className='absolute top-[14px] left-6 h-0.5 bg-gradient-to-r from-green-500 to-black transition-all duration-500 ease-out -z-0'
                        style={{ 
                            width: `${(currentIndex / (steps.length - 1)) * 100}%`,
                            maxWidth: 'calc(100% - 3rem)'
                        }}
                    ></div>
                </div>
            </div>

            <div className='overflow-auto flex-1 '>
            {currentIndex === 0 && <VideoDetail uploadVideoDetail = {uploadVideoDetail} file={file} className></VideoDetail>} 
            {currentIndex === 1 && <h1>This is check</h1>}
            {currentIndex === 2 && <h1>this is visibility</h1>}
            </div>
        <div className='max-h-[20%] mb-4 flex justify-between items-center border-t pt-2 border-gray-600'>
            <div className='flex gap-3 item-center'>
                <HiUpload className='text-2xl text-gray-600'/>
                <MdOutlineHd className='text-2xl text-gray-600' />
                <FaRegCheckCircle className='text-2xl text-gray-600' />
                {(progress === 0) && <p className=' text-gray-600'>Upload starting...</p>}
                {(progress > 0) && progress < 100 && <p className=' text-gray-600'>Uploading {progress}%</p>}
                {(progress === 100) && <p className=' text-gray-600'>Video uploaded successfully!</p>}
            </div>
            <div className='bg-black text-white max-w-max px-7 py-2 rounded-full' onClick={() => setCurrentIndex(currentIndex + 1)} >
                {currentIndex === 2 ? 'Finish' : 'Next'}
            </div>
        </div>

            <style jsx>{`
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-in-out;
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}

export default UploadVideoDetail;