import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <h1 className='text-pretty text-red-300 text-2xl text-center w-screen h-screen'>
      Real estate project
    </h1>
  )
}

export default App
