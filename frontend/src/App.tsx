import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useStore } from './store/useStore';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CreateAssignment from './pages/CreateAssignment';
import AssignmentResult from './pages/AssignmentResult';

export default function App() {
  const updateAssignment = useStore(state => state.updateAssignment);
  const setCachedPaper = useStore(state => state.setCachedPaper);
  
  useEffect(() => {
    const socket = io('/', { path: '/socket.io' });
    
    socket.on('job:update', (assignment) => {
      updateAssignment(assignment);
    });
    
    socket.on('job:completed', (data) => {
      setCachedPaper(data.assignmentId, data.paper);
    });
    
    return () => {
      socket.disconnect();
    };
  }, [updateAssignment, setCachedPaper]);

  return (
    <Router>
      <div className="flex h-screen bg-[#F5F5F5] font-sans selection:bg-orange-200">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/assignments" replace />} />
            <Route path="/assignments" element={<Dashboard />} />
            <Route path="/assignments/new" element={<CreateAssignment />} />
            <Route path="/assignments/:id" element={<AssignmentResult />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Trigger git sync
