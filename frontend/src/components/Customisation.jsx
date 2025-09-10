import coverMock from '../assets/coverMock.png'
// import '../assets/coverMock.png';

function Customisation({isSidebarOpen}) {
    
    return(
        <>
        <div className={`channel-customisation-container flex-1' ${isSidebarOpen ? 'ml-[200px]' : 'ml-[100px]'} min-h-screen transition-all duration-300 mr-10 mb-10`} >
            <h1 className="main-heading text-2xl font-medium">Channel customisation</h1>
            <div className="form-wrapper mt-5 w-[50%]">
                <div className="banner-image mb-5">
                    <h3 className="text-xl ">Banner image</h3>
                    <p className="text-[13px] text-gray-600">This image will appear across the top of your channel.</p>
                    <div className="mt-4 flex justify-start gap-x-5">
                        <img src={coverMock} alt="banner_img" className='w-60' />
                        <div>
                            <p className="text-[13px] text-gray-600">For the best results on all devices, use an image that's at least 2048 x 1152 pixels and 6 MB or less. </p>
                            <button className='px-4 py-2 mt-5 bg-gray-100 rounded-2xl hover:bg-gray-200 cursor-pointer'>Upload</button>
                        </div>
                    </div>
                </div>
                <div className="picture mb-5">
                    <h3 className="text-xl ">Picture</h3>
                    <p className="text-[13px] text-gray-600">Your profile picture will appear where your channel is presented on YouTube, such as next to your videos and comments</p>
                    <div className="mt-4 flex justify-start gap-x-5">
                        <img src={coverMock} alt="  " className='w-40 h-40 aspect-square rounded-full m-2 p-1 border border-gray-200'/>
                        <div>
                            <p className="text-[13px] text-gray-600">It's recommended that you use a picture that's at least 98 x 98 pixels and 4 MB or less. Use a PNG or GIF (no animations) file. Make sure that your picture follows the YouTube Community Guidelines. </p>
                            <div className='flex gap-x-3'>
                                <button className='px-4 py-2 mt-5 bg-gray-100 rounded-2xl hover:bg-gray-200 cursor-pointer'>Change</button>
                                <button className='px-4 py-2 mt-5 bg-gray-100 rounded-2xl hover:bg-gray-200 cursor-pointer'>Remove</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="Name mb-5">
                    <h3 className="text-xl ">Name</h3>
                    <p className="text-[13px] text-gray-600">Choose a channel name that represents you and your content. Changes made to your name and picture are only visible on YouTube and not on other Google services. You can change your name twice in 14 days. </p>
                    <input type="text" className="mt-3 h-10 w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"/>
                </div>


                <div className="description mb-100">
                    <h3 className="text-xl ">Description</h3>
                    <textarea
                        placeholder="Tell viewers about your channel. Your description will appear in the About section of your channel and search results, among other places."
                        className="mt-3 w-full h-32 border border-gray-300 focus:ring-2 focus:ring-gray-600 rounded-md focus:outline-none px-3 py-2 resize-none placeholder:text-[13px]"
                        />
                </div>
            </div>
        </div>
        </>
    )
}

export {Customisation}