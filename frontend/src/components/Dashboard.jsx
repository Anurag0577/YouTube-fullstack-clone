import { useDispatch, useSelector } from 'react-redux';
import Uploader from './Uploader.jsx'

function Dashboard() {
    const createVideoPopup = useSelector(state => state.createVideoPopup.value)
    console.log(createVideoPopup);
  return (
    <>
      <div className="w-full h-full relative p-4">
        {/* Main Page Content */}
        <p>hello World</p>
        <p>hello World</p>
        <p>hello World</p>
        <p>hello World</p>
        <p>hello World</p>
        <p>hello World</p>
        <p>hello World</p>
        <p>hello World</p>
        <p>hello World</p>
        <p>hello World</p>
        {/* ... your repeated text */}
      </div>

      {/* Popup / Modal */}
      {createVideoPopup && 
      (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-2xl shadow-lg pb-6  w-[65%]">
          <Uploader />
        </div>
      </div>)
      }
    </>
  );
}

export default Dashboard;
