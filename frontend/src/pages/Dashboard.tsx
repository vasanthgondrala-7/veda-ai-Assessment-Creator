import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Plus, MoreVertical, Loader2, Search, Bell } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Assignment } from '../types';

export default function Dashboard() {
  const { assignments, setAssignments } = useStore();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/assignments')
      .then(res => res.json())
      .then(data => {
        setAssignments(data);
        setLoading(false);
      });
  }, [setAssignments]);

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa]">
      <header className="h-[72px] px-8 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center max-w-lg w-full relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
           <input 
             type="text" 
             placeholder="Search..." 
             className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
           />
        </div>
        
        <div className="flex items-center gap-4">
           <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors relative">
              <Bell size={20} />
              <div className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
           </button>
           <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
             <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=John" alt="User" />
             </div>
             <span className="text-sm font-medium text-gray-700 hidden sm:block">John Doe</span>
           </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-8">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-primary opacity-50" />
          </div>
        ) : assignments.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center h-[70vh] max-w-md mx-auto text-center">
            <div className="relative mb-6">
              <div className="w-32 h-40 bg-white border-2 border-gray-200 rounded-xl shadow-sm flex items-center justify-center relative z-10">
                 <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center border border-red-100">
                    <span className="text-red-500 font-bold text-xl">X</span>
                 </div>
              </div>
              <div className="absolute -bottom-4 right-0 transform translate-x-1/2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-md shadow-sm z-20">
                 Yaseen Ron
              </div>
              
              <div className="absolute -top-4 -right-8 text-yellow-400">â</div>
              <div className="absolute top-10 -left-6 text-primary scale-75">â</div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2 mt-4">No assignments yet</h3>
            <p className="text-gray-500 text-sm mb-8 px-4">
              Use AI to create assignments instantly! Upload existing materials or generate from scratch.
            </p>
            
            <NavLink 
              to="/assignments/new"
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-full font-medium shadow-sm transition-transform active:scale-95 text-sm"
            >
              <span className="text-lg leading-none">+</span>
              Create your first assignment
            </NavLink>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Assignments</h2>
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                {assignments.map(assignment => (
                  <AssignmentCard key={assignment.id} assignment={assignment} onClick={() => navigate(`/assignments/${assignment.id}`)} />
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Trigger git sync
function AssignmentCard({ assignment, onClick }: { assignment: Assignment, onClick: () => void, key?: string | number }) {
  const isGenerating = assignment.status === 'generating' || assignment.status === 'pending';
  
  return (
    <div 
      onClick={isGenerating ? undefined : onClick}
      className={`group bg-white p-6 rounded-2xl border border-gray-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all ${isGenerating ? 'opacity-80 cursor-default' : 'hover:shadow-md hover:border-gray-300 cursor-pointer'}`}
    >
       <div className="flex items-start justify-between gap-4 mb-4">
         <h3 className="text-lg font-bold text-gray-900 truncate flex-1">{assignment.subject || 'Untitled'} Assignment</h3>
         <button className="text-gray-400 hover:text-gray-600 p-1 -mt-1 -mr-2 rounded-md transition-colors" onClick={(e) => { e.stopPropagation(); }}>
           <MoreVertical size={18} />
         </button>
       </div>
       
       <div className="flex flex-col gap-2 text-sm text-gray-500 mb-6">
         <div className="flex justify-between">
           <span className="font-medium text-gray-400">Subject:</span>
           <span className="text-gray-700">{assignment.subject || 'N/A'}</span>
         </div>
         <div className="flex justify-between">
           <span className="font-medium text-gray-400">Created:</span>
           <span className="text-gray-700">{format(new Date(assignment.createdAt), 'dd-MM-yyyy')}</span>
         </div>
         <div className="flex justify-between">
           <span className="font-medium text-gray-400">Due:</span>
           <span className="text-gray-700">{format(new Date(assignment.dueDate), 'dd-MM-yyyy')}</span>
         </div>
       </div>
       
       <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-gray-500 text-xs font-medium">
             ID: {assignment.id.substring(0, 8)}
          </div>
          
          <div className={`px-3 py-1 rounded border text-xs font-semibold uppercase tracking-wider ${
             isGenerating ? 'bg-orange-50 border-orange-200 text-primary' : 
             'bg-green-50 border-green-200 text-green-600'
          }`}>
             {isGenerating ? 'Generating' : 'Generated'}
          </div>
       </div>
    </div>
  );
}

