import { Route, Routes } from 'react-router-dom';
import Sidebar from './components/sidebar/sidebar';
function App() {


  return (
    <>
      <Sidebar/>
      <Routes>
        <Route path='' element={<h1>hello</h1>} />
        
      </Routes>
    </>
  )
}

export default App
