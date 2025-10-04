import { useState } from 'react'
import coverMock from '../assets/coverMock.png'
import axios from 'axios';
// import '../assets/coverMock.png';
import api from '../api/axios';

function CreateChannel() {
    // useState to remember values b/w renders..
    const [name, setName] = useState('')
    const [coverUrl, setCoverUrl] = useState('');
    const [channelAvatar, setChannelAvatar] = useState('')
    const [description, setDescription] = useState('')
    const [coverFile, setCoverFile] = useState(null)
    const [avatarFile, setAvatarFile] = useState(null)

    // upload cover image to cloudinary
    const coverUploader = async(e) => {
        const selectedFile = e.target.files[0];
        setCoverFile(selectedFile);

        if(selectedFile){
            const formData = new FormData();
            formData.append('image', selectedFile);
            try{
                const res = await api.post('/upload/image/single', formData)
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
            formData.append('avatar', selectedFile);
            try{
                const res = await api.post('/upload/avatar', formData)

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

    const createChannel = async() => {
        try{
            const res = await api.post('/channel/manual', {
                channelName: name,
                description,
                avatar: channelAvatar,
                cover: coverUrl
            })
            console.log(res.data.data);

            console.log('Channel Create successfully', res.data.data)
        } catch(err){
            console.log(err)
        }
    }

    // upload cover image using coverUploader
    // upload avatar using avatar uploader
    // when save/publish button press -> update the channel details using put api

    return(
        <>
    <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
            <h1 className="main-heading text-2xl font-medium">Channel customisation</h1>
            <button 
            className="px-4 py-2 mt-2 bg-gray-100 rounded-2xl hover:bg-gray-200 cursor-pointer"
            onClick={createChannel}
            >
            Publish
            </button>
        </div>

  {/* Scrollable body */}
  <div className="flex-1 overflow-y-auto px-5 pb-10">
    <div className="form-wrapper mt-5 w-full lg:w-1/2 mx-auto">
      
      {/* Banner Image */}
      <div className="banner-image mb-5">
        <h3 className="text-xl">Banner image</h3>
        <p className="text-[13px] text-gray-600">
          This image will appear across the top of your channel.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-5">
          <img src={coverUrl} alt="banner_img" className="w-full sm:w-60 object-cover rounded-md" />
          <div className="flex flex-col">
            <p className="text-[13px] text-gray-600">
              For best results use 2048x1152px &lt; 6MB.
            </p>
            <label className="px-4 py-2 bg-gray-100 rounded-2xl hover:bg-gray-200 cursor-pointer text-center mt-5">
              Upload
              <input type="file" onChange={coverUploader} hidden />
            </label>
          </div>
        </div>
      </div>

      {/* Picture */}
      <div className="picture mb-5">
        <h3 className="text-xl">Picture</h3>
        <p className="text-[13px] text-gray-600">
          Your profile picture will appear where your channel is presented.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-5">
          <img src={channelAvatar} alt="avatar" className="w-32 h-32 sm:w-40 sm:h-40 aspect-square rounded-full border border-gray-200" />
          <div>
            <p className="text-[13px] text-gray-600">
              Recommended: 98x98px, under 4MB (PNG/GIF).
            </p>
            <div className="flex gap-3 mt-3">
              <label className="px-4 py-2 bg-gray-100 rounded-2xl hover:bg-gray-200 cursor-pointer">
                Change
                <input type="file" onChange={avatarUploader} hidden />
              </label>
              <button 
                className="px-4 py-2 bg-gray-100 rounded-2xl hover:bg-gray-200 cursor-pointer"
                onClick={removeAvatar}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Name */}
      <div className="Name mb-5">
        <h3 className="text-xl">Name</h3>
        <p className="text-[13px] text-gray-600">
          Choose a channel name that represents you. (Changes are YouTube only)
        </p>
        <input
          type="text"
          className="mt-3 h-10 w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      {/* Description */}
      <div className="description mb-20">
        <h3 className="text-xl">Description</h3>
        <textarea
          placeholder="Tell viewers about your channel..."
          className="mt-3 w-full h-32 border border-gray-300 focus:ring-2 focus:ring-gray-600 rounded-md focus:outline-none px-3 py-2 resize-none placeholder:text-[13px]"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>
    </div>
  </div>
</div>


        </>
    )
}

export {CreateChannel}