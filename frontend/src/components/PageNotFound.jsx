import React from 'react';
import { useNavigate } from 'react-router-dom';


const PageNotFound = () => {
  const navigate = useNavigate();
  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="w-12 h-12 text-red-500 text-6xl">!</span>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Sorry, we couldn't find the page you're looking for. 
            The page might have been moved, deleted, or the URL might be incorrect.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <button
            onClick={handleGoHome}
            className="w-full bg-gray-300 cursor-pointer text-black font-medium py-3 px-6 rounded  flex items-center justify-center gap-2"
          >
            <span className="w-5 h-5 mr-2">🏠</span>
            Go to Homepage
          </button>
        </div>

        <div className="text-sm text-gray-500">
          <p>If you think this is a mistake, please contact support.</p>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;