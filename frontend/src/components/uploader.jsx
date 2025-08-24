import { IoCloseCircleOutline } from 'react-icons/io5';
import { RiVideoUploadFill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { hide } from '../slice/createVideoPopupShow';
import Button from './Button';
import { useState } from 'react';
import axios from 'axios';
import SelectFile from './selectFile';
import UploadVideoDetail from './UploadVideoDetail';
import { TbRuler2Off } from 'react-icons/tb';

function Uploader(){
    // file state variable - this variable contain the file that i want to upload
    const [file, setFile] = useState(null);

    return(
        <>
        {
            file ? 
            <UploadVideoDetail file={file} /> 
            : <SelectFile setFile={setFile}/>
        }
        </>
    )
}

export default Uploader;




// create a button that trigger the file upload
// save the file input in a state variable 
// this state variable will give you all details of the file like name, size etc.
// Now we have to upload this file (Generally we do it by formData but here we use multer + cloudinary)
// Do research and find the way to track the progress show the progress then in the UI.