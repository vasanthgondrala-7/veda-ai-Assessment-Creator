import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, FileDown, RefreshCcw, Loader2, AlertCircle, Share2, Printer, Search, Bell, Edit } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useStore } from '../store/useStore';
import { Assignment, GeneratedPaper } from '../types';

export default function AssignmentResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const paperRef = useRef<HTMLDivElement>(null);
  
  const { assignments, updateAssignment, cachedPapers, setCachedPaper } = useStore();
  
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  
  const assignment = assignments.find(a => a.id === id);
  const paper = cachedPapers[id || ''];

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    fetch(`/api/assignments/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
           updateAssignment(data.assignment);
           if (data.paper) {
             setCachedPaper(id, data.paper);
           }
        }
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, [id]);

  const handleRegenerate = async () => {
    if (!id) return;
    setRegenerating(true);
    try {
      const res = await fetch(`/api/assignments/${id}/regenerate`, { method: 'POST' });
      const data = await res.json();
      updateAssignment(data);
    } catch (e) {
      console.error(e);
    }
    setRegenerating(false);
  };

  const downloadPDF = async () => {
    if (!paperRef.current || downloading) return;
    setDownloading(true);
    
    try {
      const element = paperRef.current;
      
      const canvas = await html2canvas(element, {
         scale: 2,
         useCORS: true,
         logging: false,
         backgroundColor: '#ffffff'
      });
      
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`${assignment?.subject || 'Assignment'}_Paper.pdf`);
    } catch (err) {
      console.error("PDF generation failed", err);
      alert("Failed to generate PDF. Please try again.");
    }
    
    setDownloading(false);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#f8f9fa]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-4 bg-[#f8f9fa]">
         <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-2">
            <AlertCircle size={32} />
         </div>
         <h2 className="text-xl font-bold text-gray-900">Assignment Not Found</h2>
         <button onClick={() => navigate('/assignments')} className="text-primary hover:underline font-medium">Go back to Dashboard</button>
      </div>
    );
  }

  const isGenerating = assignment.status === 'pending' || assignment.status === 'generating';
  const isFailed = assignment.status === 'failed';

  return (
    <div className="flex flex-col h-full bg-[#E5E7E9] overflow-y-auto">
      <header className="h-[72px] px-8 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-4">
           <button onClick={() => navigate('/assignments')} className="text-gray-500 hover:bg-gray-100 p-2 rounded-lg">
             <ChevronLeft size={20} />
           </button>
           <div className="flex items-center max-w-lg w-full relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
           </div>
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

      <div className="flex-1 p-8 flex flex-col items-center">
        
        <div className="w-full max-w-[850px] bg-gray-900 text-white rounded-t-xl p-4 flex flex-col sm:flex-row items-center justify-between shadow-sm gap-4">
           <div className="flex items-center gap-2 text-sm font-medium">
             <span>Currently, viewing AI Generated Question Paper for your CBSE Class 5 Science...</span>
           </div>
           
           <div className="flex items-center gap-3">
              <button 
                onClick={handleRegenerate}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-md text-sm font-medium transition-colors"
                disabled={regenerating}
              >
                {regenerating ? <Loader2 size={14} className="animate-spin" /> : <RefreshCcw size={14} />}
                Regenerate
              </button>
              {assignment.status === 'completed' && (
                <button 
                  onClick={downloadPDF}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-gray-900 hover:bg-gray-100 rounded-md text-sm font-medium transition-colors"
                  disabled={downloading}
                >
                  {downloading ? <Loader2 size={14} className="animate-spin" /> : <FileDown size={14} />}
                  Export as PDF
                </button>
              )}
           </div>
        </div>

        {isGenerating ? (
          <div className="w-full max-w-[850px] bg-white p-16 flex flex-col items-center justify-center text-center shadow-lg rounded-b-xl min-h-[600px]">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Generating...</h3>
            <p className="text-gray-500">Please wait while the AI structures your paper.</p>
          </div>
        ) : isFailed ? (
          <div className="w-full max-w-[850px] bg-white p-16 flex flex-col items-center justify-center text-center shadow-lg rounded-b-xl min-h-[600px]">
             <AlertCircle size={48} className="text-red-500 mb-4" />
             <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to Generate</h3>
             <p className="text-gray-500 mb-6">There was an issue creating your paper. Please try again.</p>
             <button onClick={handleRegenerate} className="px-6 py-2 bg-primary text-white rounded-md font-medium">Try Again</button>
          </div>
        ) : paper ? (
          <div className="w-full max-w-[850px] bg-white shadow-lg rounded-b-xl overflow-hidden">
             
             <div 
               ref={paperRef}
               className="bg-white px-12 py-16 min-h-[1122px] print:m-0 print:shadow-none print:px-8 print:py-8 w-full font-serif text-[15px] leading-relaxed text-black"
             >
                <div className="text-center pb-6">
                   <h1 className="text-2xl font-bold font-sans tracking-tight mb-1">Delhi Public School, Sector-4, Bokaro</h1>
                   <h2 className="text-lg font-semibold font-sans mb-1">Subject: {assignment.subject}</h2>
                   <h3 className="text-md font-medium font-sans text-gray-700">Class: 5th</h3>
                </div>

                <div className="flex justify-between items-end mb-6 text-sm font-sans font-medium px-2 pb-2 border-b border-gray-300">
                   <div>
                      <p>Time Allowed: 45 Minutes</p>
                   </div>
                   <div>
                      <p>Maximum Marks: {assignment.marks}</p>
                   </div>
                </div>

                <div className="mb-8 text-sm font-sans px-2">
                   <p className="italic mb-2">All questions are compulsory unless stated otherwise.</p>
                </div>

                <div className="mb-12 font-sans px-2 space-y-4">
                    <div className="flex items-end">
                      <span className="font-semibold w-28 shrink-0">Name:</span>
                      <div className="flex-1 border-b border-black h-5"></div>
                    </div>
                    <div className="flex items-end">
                      <span className="font-semibold w-28 shrink-0">Roll Number:</span>
                      <div className="flex-1 border-b border-black h-5"></div>
                    </div>
                    <div className="flex items-end">
                      <span className="font-semibold w-28 shrink-0">Section:</span>
                      <div className="flex-1 border-b border-black h-5"></div>
                    </div>
                </div>

                <div className="space-y-12 px-2">
                   {paper.sections.map((section, sIdx) => (
                     <div key={sIdx} className="break-inside-avoid">
                        <div className="text-center mb-6 font-sans">
                           <h3 className="text-lg font-bold tracking-widest">{section.title}</h3>
                           {section.instructions && (
                             <p className="text-sm italic text-gray-600 mt-1">{section.instructions}</p>
                           )}
                        </div>
                        
                        <div className="space-y-6">
                           {section.questions.map((q, qIdx) => (
                             <div key={q.id} className="group relative flex gap-4 text-justify print:break-inside-avoid">
                                <span className="font-semibold shrink-0 w-6 text-right">{qIdx + 1}.</span>
                                <div className="flex-1 text-[15px] text-gray-800">
                                   <p className="inline leading-relaxed">{q.text}</p>
                                   
                                   <div className="flex items-center gap-2 mt-2 print:hidden opacity-0 group-hover:opacity-100 transition-opacity">
                                      <span className={`text-[10px] px-2 py-0.5 rounded font-sans font-bold uppercase tracking-wider ${
                                         q.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                         q.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                                         'bg-red-100 text-red-700'
                                      }`}>
                                        {q.difficulty}
                                      </span>
                                   </div>
                                </div>
                                <div className="shrink-0 font-sans font-semibold text-sm pt-0.5">
                                   [{q.marks}]
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>
                   ))}
                </div>
                
             </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// Trigger git sync