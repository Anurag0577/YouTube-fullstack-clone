import './App.css'
import Login from './components/Login.jsx'
import SignUp from './components/SignUp.jsx'
import Homepage from './components/Homepage.jsx'
import Dashboard from './components/Dashboard.jsx'
import {Provider} from 'react-redux'
import store from '../src/store.js'
import VideoPlayerPage from './components/VideoPlayerPage.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import PageNotFound from './components/PageNotFound.jsx'
import ChannelPage from './components/ChannelPage.jsx'
import ProtectedRoutes from './components/ProtectedRoutes.jsx'
import Subscription from './components/Subscription.jsx'


function App() {
  const router = createBrowserRouter([
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/signup',
      element: <SignUp/>
    },
    {
      path: '/',
      element: <Homepage/>
    },
    {
      path: '/channel-dashboard',
      element: (
        <ProtectedRoutes>
          <Dashboard/>
        </ProtectedRoutes>
      )
    },
    {
      path: "/channel/:channelId",
      element: <ChannelPage/>
    },
    {
      path: "/videos/player/:vidId",
      element: <VideoPlayerPage/>
    },
    {
      path: '/subscription',
      element: <Subscription/>
    }
  ])

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  )
}

export default App
