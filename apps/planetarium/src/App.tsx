import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import Planetarium from '@openastrodynamics/r3f'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Planetarium />
    </div>
  )
}

export default App
