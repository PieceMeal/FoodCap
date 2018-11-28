import React from 'react'
import Navbar from '../client/components/navbar'

import Routes from './routes'

const App = () => {
  return (
    <div>
      <Navbar />
      <div className="main">
        <Routes />
      </div>
    </div>
  )
}

export default App
