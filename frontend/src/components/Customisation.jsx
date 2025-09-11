import { useState } from 'react'
import coverMock from '../assets/coverMock.png'
import axios from 'axios';
// import '../assets/coverMock.png';

function Customisation({isSidebarOpen, channelDetail}) {
    // useState to remember values b/w renders..
    const [name, setName] = useState(channelDetail.channelName)
    const [coverUrl, setCoverUrl] = useState(channelDetail.cover || coverMock);
    const [channelAvatar, setChannelAvatar] = useState(channelDetail.avatar || coverMock)
    const [description, setDescription] = useState(channelDetail.description)
    const [coverFile, setCoverFile] = useState(null)
    const [avatarFile, setAvatarFile] = useState(null)

    // upload cover image to cloudinary
    const coverUploader = async(e) => {
        const selectedFile = e.target.files[0];
        setCoverFile(selectedFile);

        if(selectedFile){
            const formData = new FormData();
            const accessToken= localStorage.getItem('accessToken')
            formData.append('image', selectedFile);
            try{
                const res = await axios.post('http://localhost:3000/api/upload/image/single', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${accessToken}`
                }
            })
                console.log(res.data.data.url);
                setCoverUrl(res.data.data.url)

            } catch(err){
                console.log('Error', err)
            }
            
        }
    }

    const avatarUploader = async(e) => {
        const selectedFile = e.target.files[0];
        setAvatarFile(selectedFile);

        if(selectedFile){
            const formData = new FormData();
            const accessToken = localStorage.getItem('accessToken')
            formData.append('avatar', selectedFile);
            try{
                const res = await axios.post('http://localhost:3000/api/upload/avatar', formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })

                console.log(res.data.data.url);
                setChannelAvatar(res.data.data.url)
            } catch(err){
                console.log('Error', err)
            }
        }
    }

    const removeAvatar = () => {
        setChannelAvatar(null)
    }

    const updateChannelDetail = async() => {
        const accessToken = localStorage.getItem('accessToken');
        try{
            const res = await axios.put('http://localhost:3000/api/dashboard/channel', {
                channelName: name,
                description,
                avatar: channelAvatar,
                cover: coverUrl
            },
            {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
            console.log(res.data.data);
        } catch(err){
            console.log(err)
        }
    }

    // upload cover image using coverUploader
    // upload avatar using avatar uploader
    // when save/publish button press -> update the channel details using put api

    return(
        <>
        <div className={`channel-customisation-container flex-1' ${isSidebarOpen ? 'ml-[200px]' : 'ml-[100px]'} min-h-screen transition-all w-full duration-300 mr-10 mb-10`} >
            <div className='flex justify-between items-center border-b border-gray-200 pb-3'>
                <h1 className="main-heading text-2xl font-medium">Channel customisation</h1>
                <button className='px-4 py-2 mt-5 bg-gray-100 rounded-2xl hover:bg-gray-200 cursor-pointer' onClick={updateChannelDetail}>Publish</button>
            </div>
            
            <div className="form-wrapper mt-5 lg:w-[50%]">
                <div className="banner-image mb-5">
                    <h3 className="text-xl ">Banner image</h3>
                    <p className="text-[13px] text-gray-600">This image will appear across the top of your channel.</p>
                    <div className="mt-4 flex justify-start gap-x-5">
                        <img src={coverUrl} alt="banner_img" className='w-60' />
                        <div className='flex flex-col'>
                            <p className="text-[13px] text-gray-600">For the best results on all devices, use an image that's at least 2048 x 1152 pixels and 6 MB or less. </p>
                            {/* <button className='px-4 py-2 mt-5 bg-gray-100 rounded-2xl hover:bg-gray-200 cursor-pointer'>Upload</button> */}
                            <label className='px-4 py-2 max-w-30 bg-gray-100 rounded-2xl hover:bg-gray-200 cursor-pointer text-center mt-5' >
                                Upload
                                <input 
                                type="file"
                                onChange={coverUploader}
                                hidden
                                />
                            </label>
                        </div>
                    </div>
                </div>
                <div className="picture mb-5">
                    <h3 className="text-xl ">Picture</h3>
                    <p className="text-[13px] text-gray-600">Your profile picture will appear where your channel is presented on YouTube, such as next to your videos and comments</p>
                    <div className="mt-4 flex justify-start gap-x-5">
                        <img src={channelAvatar} alt="  " className='w-40 h-40 aspect-square rounded-full m-2 p-1 border border-gray-200'/>
                        <div>
                            <p className="text-[13px] text-gray-600">It's recommended that you use a picture that's at least 98 x 98 pixels and 4 MB or less. Use a PNG or GIF (no animations) file. Make sure that your picture follows the YouTube Community Guidelines. </p>
                            <div className='flex gap-x-3'>
                                {/* <button className='px-4 py-2 mt-5 bg-gray-100 rounded-2xl hover:bg-gray-200 cursor-pointer'>Change</button> */}
                                <label className='px-4 py-2 max-w-30 bg-gray-100 rounded-2xl hover:bg-gray-200 cursor-pointer text-center mt-5' >
                                Change
                                <input 
                                type="file"
                                onChange={avatarUploader}
                                hidden
                                />
                            </label>
                                <button className='px-4 py-2 mt-5 bg-gray-100 rounded-2xl hover:bg-gray-200 cursor-pointer'
                                    onChange={removeAvatar}
                                >Remove</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="Name mb-5">
                    <h3 className="text-xl ">Name</h3>
                    <p className="text-[13px] text-gray-600">Choose a channel name that represents you and your content. Changes made to your name and picture are only visible on YouTube and not on other Google services. You can change your name twice in 14 days. </p>
                    <input type="text" className="mt-3 h-10 w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400" value={name} onChange={e => setName(e.target.value)}/>
                </div>


                <div className="description mb-100">
                    <h3 className="text-xl ">Description</h3>
                    <textarea
                        placeholder="Tell viewers about your channel. Your description will appear in the About section of your channel and search results, among other places."
                        className="mt-3 w-full h-32 border border-gray-300 focus:ring-2 focus:ring-gray-600 rounded-md focus:outline-none px-3 py-2 resize-none placeholder:text-[13px]" value={description}
                        />
                </div>
            </div>
        </div>
        </>
    )
}

export {Customisation}