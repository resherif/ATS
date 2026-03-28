import { Route, Routes } from 'react-router-dom';
import Sidebar from './components/sidebar/sidebar';
import { useState } from 'react';
function App() {

  const [BarMenuIsOpen, setBarMenuIsOpen] = useState(true);
  return (
    <>
      <Sidebar isOpen={ BarMenuIsOpen} />
      <Routes>
        <Route path='' element={<h1>hello</h1>} />
        
      </Routes>
    </>
  )
}

export default App
