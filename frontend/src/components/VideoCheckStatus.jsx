import React from 'react';

const VideoCheckStatus = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm font-sans">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-xl font-normal text-gray-800 mb-4">Checks</h2>
        <p className="text-sm text-gray-600 leading-5 mb-2">
          We'll check your video for issues that may restrict its visibility and then you will have the 
          opportunity to fix issues before publishing your video.
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Checks will not be run until SD has finished processing.</span>{' '}
          <a href="#" className="text-blue-600 hover:underline">Learn more</a>
        </p>
      </div>

      {/* Copyright Section */}
      <div className="mb-8">
        <h3 className="text-base font-medium text-gray-400 mb-2">Copyright</h3>
        <p className="text-sm text-gray-400">
          Checking if your video contains any copyrighted content
        </p>
      </div>

      {/* Footer Section */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-400 leading-5 mb-6">
          Remember: These check results aren't final. Issues may come up in the future that 
          impact your video.{' '}
          <a href="#" className="text-blue-600 hover:underline">Learn more</a>
        </p>
        <div className="flex justify-end">
          <button className="text-xs text-blue-600 hover:underline bg-transparent border-none cursor-pointer p-0">
            Send feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCheckStatus;
