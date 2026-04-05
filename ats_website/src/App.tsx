import Sidebar from './components/sidebar/sidebar';
import { useState } from 'react';
import Navbar from './components/navbar/navbar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Jobs from './pages/jobs/jobs';
import AddJobs from './pages/jobs/AddJobs';
import CandidatesPage from './pages/candidates/candidates'
function App() {
  const [IsOpen, setBarMenuIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <Navbar IsOpen={IsOpen} setIsOpen={setBarMenuIsOpen} />

      <div className="flex flex-1">

        <Sidebar isOpen={IsOpen} />


        <main className={`flex-1 pt-14 transition-all duration-300 ${IsOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="p-8">
            <Routes>
             
              <Route path='/' element={<Dashboard />} />
              <Route path='/jobs' element={<Jobs />} />
              <Route path='/jobs/AddJobs' element={<AddJobs />} />
              <Route path="/jobs/AddJobs/:id" element={<AddJobs />} />
              <Route path='/candidates' element={<CandidatesPage />} />
            </Routes>

          </div>
        </main>
      </div>
    </div>
  )
}

export default App;