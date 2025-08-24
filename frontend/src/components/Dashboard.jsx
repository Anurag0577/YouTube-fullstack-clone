import { useDispatch, useSelector } from 'react-redux';
import Uploader from './uploader';

function Dashboard() {
    const createVideoPopup = useSelector(state => state.createVideoPopup.value)
    console.log(createVideoPopup);
  return (
    <>
      <div className="w-full h-full relative p-4">
        {/* Main Page Content */}
        <p>hello World</p>
        {/* ... your repeated text */}
      </div>

      /* Popup / Modal */
      {createVideoPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-2">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg md:max-w-2xl lg:max-w-3xl p-4 md:p-6 transition-all h-[90%]">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
            </div>
            {/* Uploader Component */}
            <Uploader />
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
