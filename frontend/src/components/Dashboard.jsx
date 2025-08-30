import { useSelector } from "react-redux";
import Uploader from "./uploader";
import { useState } from "react";
import Headers from '../components/Header.jsx'
import { AiOutlineHome } from 'react-icons/ai';
import { MdOutlineSubscriptions } from 'react-icons/md';

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const createVideoPopup = useSelector(
    (state) => state.createVideoPopup.value
  );
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <div className="flex flex-col w-full h-screen">
        <Headers/>
          <div className="flex w-full h-full">
        {isSidebarOpen && 
          <div className="sideBar-container min-w-[200px] h-[100vh] text-black bg-white flex flex-col">
          {/* Sidebar Items */}
          <div className="sidebar-item-container flex-1">
            <ul className="space-y-2 p-4">
              <li className="px-4 py-2 rounded flex hover:bg-black hover:text-white cursor-pointer transition">
                <AiOutlineHome className="text-2xl mr-2"/>
                Home
              </li>
              <li className="px-4 py-2 rounded flex hover:bg-black hover:text-white cursor-pointer transition">
                <MdOutlineSubscriptions className="text-2xl mr-2"/>
                Subscription
              </li>
            </ul>
          </div>

          {/* Footer (optional) */}
          <div className="p-4 border-t border-gray-700 text-xs text-gray-400">
            © 2025 My App
          </div>
        </div>

        }
        

        <div className="flex-1 p-6 overflow-auto">
          <p className="text-xl font-semibold">Hello World</p>
          <p className="mt-2 text-gray-700">Some demo content goes here...</p>
        </div>
        </div>
        
        
        

        {/* SideBar */}
        
      </div>

      {createVideoPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-2">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg md:max-w-2xl lg:max-w-3xl p-4 md:p-6 transition-all h-[90%]">
            <Uploader />
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
