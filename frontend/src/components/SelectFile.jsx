import { IoCloseCircleOutline } from 'react-icons/io5';
import { RiVideoUploadFill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { hide } from '../slice/createVideoPopupShow';
import Button from './Button';
import { useState } from 'react';
import axios from 'axios';

function SelectFile({setFile}){

const dispatch = useDispatch();
    const [progressPercentage, setProgressPercentage] = useState(0);
    const UPLOAD_STATUS = {
        IDEAL: 'ideal',
        UPLOADING: 'uploading',
        UPLOADED: 'uploaded',
        ERROR: 'error'
    }

    async function handleFile(e) {
        const selectedFile= e.target.files[0];
        if(selectedFile){
            setFile(e.target.files[0])
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
                    <div className='upload-video-icon text-7xl items-center'><RiVideoUploadFill className='mx-auto'/></div>
                    <div className='upload-video-text'>
                        <div className='text-2xl text-center'>Drag and drop video files to upload</div>
                        <div className='text-lg text-gray-500 text-center'>Your videos will be private until you publish them.</div>
                    </div>
                    {/* <Button className='btn-primary min-h-9.5 min-w-40 text-center cursor-pointer mx-auto pt-1.5 pr-3 pb-1.5 pl-3 rounded-2xl bg-black text-white flex justify-center items-center' text='Upload Video'  ></Button> */}
                    <label className="btn-primary min-h-9.5 min-w-40 text-center cursor-pointer mx-auto pt-1.5 pr-3 pb-1.5 pl-3 rounded-2xl bg-black text-white flex justify-center items-center" style={{ borderRadius: '12px' }}>
                        Upload Video
                        <input type="file" accept="video/*" className="hidden" onChange={handleFile} />
                    </label>
                </div>
                <div className='uplaoder-footer text-center text-[12px] text-gray-600 w-[70%] mx-auto '>
                By submitting your videos to YouTube, you acknowledge that you agree to YouTube's Terms of Service and Community Guidelines.
                Please make sure that you do not violate others' copyright or privacy rights. Learn more
                </div>
            </div>
        </>
    )
}

export default SelectFile;