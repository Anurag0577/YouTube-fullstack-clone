import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Header from './components/header.jsx'
import './App.css'
import Login from './components/Login.jsx'
import SignUp from './components/SignUp.jsx'
import Homepage from './components/Homepage.jsx'
import Dashboard from './components/Dashboard.jsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import PageNotFound from './components/PageNotFound.jsx'

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
      element: <Dashboard/>
    }
  ])

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
