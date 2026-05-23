import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Loader2 } from 'lucide-react';

export default function CreateAssignment() {
  const [subject, setSubject] = useState('');
  const [marks, setMarks] = useState(100);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, marks })
      });
      const data = await res.json();
      navigate(`/assignments/${data.id}`);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create Assignment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <input 
            type="text" 
            value={subject} 
            onChange={e => setSubject(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Total Marks</label>
          <input 
            type="number" 
            value={marks} 
            onChange={e => setMarks(Number(e.target.value))}
            className="w-full border rounded p-2"
            required
            min={1}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-primary text-white px-4 py-2 rounded flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Generate Assignment
        </button>
      </form>
    </div>
  );
}
