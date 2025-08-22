import { IoCloseCircleOutline } from 'react-icons/io5';
import { RiVideoUploadFill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { hide } from '../slice/createVideoPopupShow';
import Button from './Button';
import { useState } from 'react';
import axios from 'axios';

function Uploader(){
    const dispatch = useDispatch();
    const [file, setFile] = useState(null);
    const [progressPercentage, setProgressPercentage] = useState(0);
    const [uploadStatus, setUploadStatus] = useState('ideal');
    const UPLOAD_STATUS = {
        IDEAL: 'ideal',
        UPLOADING: 'uploading',
        UPLOADED: 'uploaded',
        ERROR: 'error'
    }

    async function handleFileUpload(e) {
        if(e.target.files){
            setFile(e.target.files[0])
            setUploadStatus(UPLOAD_STATUS.UPLOADING);
        }
        const formData = new FormData();
        formData.append('video', file);

        try {
            await axios.post('http://localhost:3000/videos/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (ProgressEvent) => {
                    const progress = ProgressEvent.total? Math.round((ProgressEvent.loaded * 100)/(ProgressEvent.total)) : 0;
                    setProgressPercentage(progress)
                }
            });
            setUploadStatus(UPLOAD_STATUS.UPLOADED);
        } catch (error) {
            console.log(error);
            setUploadStatus(UPLOAD_STATUS.ERROR);
        }
        
    }

    const renderUploadContent = () => {
        switch(uploadStatus) {
            case UPLOAD_STATUS.IDEAL:
                return (
                    <>
                        <div className='upload-video-icon text-7xl items-center'><RiVideoUploadFill className='mx-auto'/></div>
                        <div className='upload-video-text'>
                            <div className='text-2xl text-center'>Drag and drop video files to upload</div>
                            <div className='text-lg text-gray-500 text-center'>Your videos will be private until you publish them.</div>
                        </div>
                        <label className="btn-primary min-h-9.5 min-w-40 text-center cursor-pointer mx-auto pt-1.5 pr-3 pb-1.5 pl-3 rounded-2xl bg-black text-white flex justify-center items-center" style={{ borderRadius: '12px' }}>
                            Upload Video
                            <input type="file" accept="video/*" className="hidden" onChange={handleFileUpload} />
                        </label>
                    </>
                );
            
            case UPLOAD_STATUS.UPLOADING:
                return (
                    <>
                        <div className='upload-video-icon text-7xl items-center'><RiVideoUploadFill className='mx-auto'/></div>
                        <div className='upload-video-text'>
                            <div className='text-2xl text-center'>Uploading Video...</div>
                            <div className='text-lg text-gray-500 text-center'>Please wait while we upload your video.</div>
                        </div>
                        <div className="w-full max-w-md mx-auto">
                            <div className="bg-gray-200 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                            </div>
                            <div className="text-center mt-2">{progressPercentage}%</div>
                        </div>
                    </>
                );
            
            case UPLOAD_STATUS.UPLOADED:
                return (
                    <>
                        <div className='upload-video-icon text-7xl items-center text-green-500'><RiVideoUploadFill className='mx-auto'/></div>
                        <div className='upload-video-text'>
                            <div className='text-2xl text-center text-green-600'>Upload Successful!</div>
                            <div className='text-lg text-gray-500 text-center'>Your video has been uploaded successfully.</div>
                        </div>
                        <button 
                            className="btn-primary min-h-9.5 min-w-40 text-center cursor-pointer mx-auto pt-1.5 pr-3 pb-1.5 pl-3 rounded-2xl bg-green-600 text-white flex justify-center items-center" 
                            style={{ borderRadius: '12px' }}
                            onClick={() => {
                                setUploadStatus(UPLOAD_STATUS.IDEAL);
                                setFile(null);
                                setProgressPercentage(0);
                            }}
                        >
                            Upload Another Video
                        </button>
                    </>
                );
            
            case UPLOAD_STATUS.ERROR:
                return (
                    <>
                        <div className='upload-video-icon text-7xl items-center text-red-500'><RiVideoUploadFill className='mx-auto'/></div>
                        <div className='upload-video-text'>
                            <div className='text-2xl text-center text-red-600'>Upload Failed</div>
                            <div className='text-lg text-gray-500 text-center'>Something went wrong. Please try again.</div>
                        </div>
                        <button 
                            className="btn-primary min-h-9.5 min-w-40 text-center cursor-pointer mx-auto pt-1.5 pr-3 pb-1.5 pl-3 rounded-2xl bg-red-600 text-white flex justify-center items-center" 
                            style={{ borderRadius: '12px' }}
                            onClick={() => {
                                setUploadStatus(UPLOAD_STATUS.IDEAL);
                                setFile(null);
                                setProgressPercentage(0);
                            }}
                        >
                            Try Again
                        </button>
                    </>
                );
            
            default:
                return null;
        }
    }

    return(
        <>
            <div className="h-[650px] w-full flex flex-col justify-between">
                <div className="uploader-header h-12 w-full flex justify-between items-center pl-6 pr-6 border-b-1 border-gray-300 ">
                    <h1 className=" text-2xl font-semibold">Upload Videos</h1>
                    <div className='text-2xl text-gray-600 cursor-pointer' onClick={() => {
                        dispatch(hide())
                    }}><IoCloseCircleOutline /></div>
                </div>
                <div className='uploader-body p-4 flex flex-col justify-center items-center h-[70%] gap-7'>
                    {renderUploadContent()}
                </div>
                <div className='uplaoder-footer text-center text-[12px] text-gray-600 w-[70%] mx-auto '>
                By submitting your videos to YouTube, you acknowledge that you agree to YouTube's Terms of Service and Community Guidelines.
                Please make sure that you do not violate others' copyright or privacy rights. Learn more
                </div>

                { file && uploadStatus === UPLOAD_STATUS.IDEAL && (
                    <div className="p-4 bg-gray-50 rounded-lg mx-4 mb-4">
                        <p className="font-semibold">Selected File:</p>
                        <p>Filename: {file.name}</p>
                        <p>Size: {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                        <p>Filetype: {file.type}</p>
                    </div>
                )}

            </div>
        </>
    )
}

export default Uploader;