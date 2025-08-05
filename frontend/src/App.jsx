import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Header from './components/header'
import './App.css'
import Login from './components/Login'
import SignUp from './components/SignUp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <SignUp></SignUp>
    </>
  )
}

export default App
