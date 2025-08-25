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
    const [currentIndex, setCurrentIndex] = useState(0)
    const steps = [
        {
            name: 'Details',
        },
        {
            name: 'Checks',
        },
        {
            name: 'Visibility',
        }
    ]

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


    return <>
    <div className='flex flex-col min-h-full'>
        <div className='flex justify-between border-b'>
            <div className='bold text-xl'>{file.name}</div>
            <div className='text-2xl text-gray-600 cursor-pointer' onClick={() => { dispatch(hide())}}>
                <IoCloseCircleOutline />
            </div>
        </div>
        <div className='flex justify-between'>
            {steps.map((step, index) => (
                <div
                    className={`flex flex-col justify-center items-center ${index < currentIndex ? 'Completed' : ''} ${index === currentIndex ? 'focused' : ''}`}
                >
                    <p>{step.name}</p>
                    <p className='p-2 rounded-full bg-gray-200'>{index + 1}</p>
                    
                </div>
            ))}
        </div>
        <div className='flex-grow overflow-auto flex justify-between '>
            {currentIndex === 0 && <VideoDetail uploadVideoDetail = {uploadVideoDetail} file={file}></VideoDetail>} 
            {currentIndex === 1 && <h1>This is check</h1>}
            {currentIndex === 2 && <h1>this is visibility</h1>}
        </div>
        <div className='mt-2 mb-4 flex justify-between items-center border-t pt-2 border-gray-600'>
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
    </div>

    </>;
}

export default UploadVideoDetail;