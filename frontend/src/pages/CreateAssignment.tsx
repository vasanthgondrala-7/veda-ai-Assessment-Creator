import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Plus, Calendar, ArrowLeft, ArrowRight, Bell, ChevronDown, CloudUpload, X, Minus, Mic, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/useStore';

interface QuestionTypeConfig {
  type: string;
  count: number;
  marks: number;
}

export default function CreateAssignment() {
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [instructions, setInstructions] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [generationStep, setGenerationStep] = useState<'idle' | 'generating' | 'generated'>('idle');
  const [questionTypes, setQuestionTypes] = useState<QuestionTypeConfig[]>([
    { type: 'Multiple Choice Questions', count: 4, marks: 1 },
    { type: 'Short Questions', count: 3, marks: 2 },
    { type: 'Diagram/Graph-Based Questions', count: 5, marks: 5 },
    { type: 'Numerical Problems', count: 5, marks: 5 },
  ]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const assignments = useStore(state => state.assignments);
  const [createdAssignmentId, setCreatedAssignmentId] = useState<string | null>(null);
  const updateAssignment = useStore(state => state.updateAssignment);

  useEffect(() => {
    if (createdAssignmentId && generationStep === 'generating') {
      const assignment = assignments.find(a => a.id === createdAssignmentId);
      if (assignment?.status === 'completed') {
        setGenerationStep('generated');
        setTimeout(() => {
          navigate(`/assignments/${createdAssignmentId}`);
        }, 1500);
      } else if (assignment?.status === 'failed') {
        navigate(`/assignments/${createdAssignmentId}`);
      }
    }
  }, [assignments, createdAssignmentId, generationStep, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleAddQuestionType = () => {
    setQuestionTypes([...questionTypes, { type: 'New Custom Type', count: 1, marks: 1 }]);
  };

  const handleUpdateQuestionType = (index: number, field: keyof QuestionTypeConfig, value: string | number) => {
    const newTypes = [...questionTypes];
    newTypes[index] = { ...newTypes[index], [field]: value };
    setQuestionTypes(newTypes);
  };

  const handleRemoveQuestionType = (index: number) => {
    setQuestionTypes(questionTypes.filter((_, i) => i !== index));
  };

  const incrementValue = (index: number, field: 'count' | 'marks') => {
    const current = Number(questionTypes[index][field]);
    handleUpdateQuestionType(index, field, current + 1);
  };

  const decrementValue = (index: number, field: 'count' | 'marks') => {
    const current = Number(questionTypes[index][field]);
    if (current > 1) {
       handleUpdateQuestionType(index, field, current - 1);
    }
  };

  const totalMarks = questionTypes.reduce((sum, qt) => sum + ((Number(qt.marks) * Number(qt.count)) || 0), 0);
  const totalQuestions = questionTypes.reduce((sum, qt) => sum + (Number(qt.count) || 0), 0);

  const handleSubmit = async () => {
    if (questionTypes.length === 0) {
      alert("Please add at least one question type.");
      return;
    }
    
    setLoading(true);
    try {
      const payload = {
        subject: subject || "Custom Assignment",
        grade,
        dueDate: dueDate ? new Date(dueDate).toISOString() : new Date().toISOString(),
        instructions,
        questionTypes: questionTypes.map(qt => ({
          type: qt.type,
          count: Number(qt.count),
          marks: Number(qt.marks)
        })),
        numberOfQuestions: totalQuestions,
        marks: totalMarks
      };

      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      updateAssignment(data);
      setCreatedAssignmentId(data.id);
      setGenerationStep('generating');
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent relative">
      {/* Top Navbar */}
      <header className="flex h-20 items-center justify-between px-10">
          <div className="flex items-center text-gray-500 hover:text-gray-900 cursor-pointer transition-colors" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5 mr-4" />
              <span className="font-semibold text-lg text-gray-400">Assignment</span>
          </div>
          <div className="flex items-center gap-6">
              <button className="relative p-1 text-gray-700 hover:text-gray-900 transition-colors">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-[#EAEAEA]"></span>
              </button>
              <div className="flex items-center gap-3 cursor-pointer bg-white px-4 py-2 rounded-full shadow-sm hover:shadow transition-shadow">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="User" className="w-8 h-8 rounded-full bg-gray-100" />
                  <span className="text-sm font-semibold text-gray-800">John Doe</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
          </div>
      </header>
  
      {generationStep !== 'idle' ? (
         <div className="flex-1 flex flex-col items-center justify-center -mt-16 px-6">
            {generationStep === 'generating' ? (
               <div className="bg-white p-14 flex flex-col items-center justify-center text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] w-full max-w-[500px] border border-gray-100/50">
                 <Loader2 className="w-14 h-14 text-indigo-500 animate-spin mb-6" />
                 <h3 className="text-[24px] font-bold text-gray-900 mb-3 tracking-tight">Crafting Paper...</h3>
                 <p className="text-gray-500 text-[15px] max-w-sm leading-relaxed">Our AI is analyzing your specific requirements and building a perfectly structured paper.</p>
               </div>
            ) : (
               <div className="bg-white p-14 flex flex-col items-center justify-center text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] w-full max-w-[500px] border border-gray-100/50">
                 <CheckCircle2 className="w-16 h-16 text-green-500 mb-6 stroke-2" />
                 <h3 className="text-[24px] font-bold text-gray-900 mb-3 tracking-tight">Generated Successfully!</h3>
                 <p className="text-gray-500 text-[15px] max-w-sm leading-relaxed">Opening your question paper automatically...</p>
               </div>
            )}
         </div>
      ) : (
      <>
      {/* Content Area */}
      <div className="px-10 pb-32 flex-1 overflow-y-auto w-full max-w-[1000px] mx-auto custom-scrollbar">
          {/* Page Title & Indicator */}
          <div className="mb-6 flex items-start gap-3 mt-4">
              <div className="mt-1.5 w-3.5 h-3.5 rounded-full bg-green-400 shadow-[0_0_0_4px_rgba(74,222,128,0.2)]"></div>
              <div>
                  <h1 className="text-[22px] font-bold text-gray-900 leading-tight">Create Assignment</h1>
                  <p className="text-gray-500 text-[15px] mt-0.5">Set up a new assignment for your students</p>
              </div>
          </div>
          
          {/* Progress Bar lines */}
          <div className="flex items-center gap-2 w-full max-w-[500px] mb-10 pl-6">
               <div className="h-1.5 flex-1 bg-gray-600 rounded-full"></div>
               <div className="h-1.5 flex-1 bg-gray-300 rounded-full"></div>
          </div>
  
          {/* Main Card */}
          <div className="bg-[#F8F9FA] rounded-[32px] p-12 shadow-sm relative">
              <h2 className="text-[20px] font-bold text-gray-900 mb-1">Assignment Details</h2>
              <p className="text-[15px] text-gray-500 mb-10">Basic information about your assignment</p>
              
              {/* File Upload Area */}
              <div className="border-[2px] border-dashed border-gray-300 rounded-[28px] p-10 flex flex-col items-center justify-center text-center bg-white mb-2 relative group hover:border-gray-400 transition-colors cursor-pointer">
                  <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" title="" />
                  
                  {uploadedFile ? (
                      <div className="flex flex-col items-center">
                          <CheckCircle2 className="text-green-500 w-10 h-10 mb-4 stroke-2" />
                          <h3 className="font-bold text-gray-900 text-[17px] mb-1">Uploaded Successfully</h3>
                          <p className="text-gray-500 text-sm">{uploadedFile.name}</p>
                      </div>
                  ) : (
                      <>
                          <CloudUpload className="text-gray-900 w-8 h-8 mb-4 stroke-2" />
                          <h3 className="font-semibold text-gray-900 text-[17px] mb-1">Choose a file or drag & drop it here</h3>
                          <p className="text-gray-400 text-sm mb-6">JPEG, PNG, upto 10MB</p>
                          <button type="button" className="bg-[#F3F4F6] hover:bg-gray-200 text-gray-800 text-[15px] font-semibold px-6 py-2.5 rounded-full transition-colors relative z-20 pointer-events-none">Browse Files</button>
                      </>
                  )}
              </div>
              <p className="text-center text-[15px] text-gray-500 mb-10">Upload images of your preferred document/image</p>
              
              {/* Form Areas */}
              <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {/* Paper Name / Subject */}
                     <div>
                        <label className="block text-[15px] font-bold text-gray-900 mb-3 ml-1">Paper Name (Subject Layout)</label>
                        <div className="relative">
                            <input 
                              type="text"
                              value={subject}
                              onChange={e => setSubject(e.target.value)}
                              placeholder="e.g. CBSE Class 5 Science"
                              className="w-full bg-transparent border-[1.5px] border-gray-300 rounded-full py-3.5 px-6 text-[15px] font-medium text-gray-800 focus:outline-none focus:border-gray-500" 
                              required
                            />
                        </div>
                     </div>
                     {/* Grade */}
                     <div>
                        <label className="block text-[15px] font-bold text-gray-900 mb-3 ml-1">Grade / Class</label>
                        <div className="relative">
                            <input 
                              type="text"
                              value={grade}
                              onChange={e => setGrade(e.target.value)}
                              placeholder="e.g. 5th Grade"
                              className="w-full bg-transparent border-[1.5px] border-gray-300 rounded-full py-3.5 px-6 text-[15px] font-medium text-gray-800 focus:outline-none focus:border-gray-500" 
                              required
                            />
                        </div>
                     </div>
                  </div>

                  {/* Due Date */}
                  <div>
                     <label className="block text-[15px] font-bold text-gray-900 mb-3 ml-1">Due Date</label>
                     <div className="relative">
                         <input 
                           ref={dateInputRef}
                           type="date"
                           value={dueDate}
                           onChange={e => setDueDate(e.target.value)}
                           className="w-full bg-transparent border-[1.5px] border-gray-300 rounded-full py-3.5 px-6 text-[15px] font-medium text-gray-800 focus:outline-none focus:border-gray-500 appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer z-10 block cursor-pointer" 
                         />
                         <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 w-[22px] h-[22px] text-gray-800 pointer-events-none z-20 transition-colors" strokeWidth={1.5} />
                     </div>
                  </div>
  
                  {/* Question Types */}
                  <div>
                      <div className="flex mb-4">
                          <div className="flex-1">
                               <label className="text-[15px] font-bold text-gray-900 ml-1">Question Type</label>
                          </div>
                          <div className="w-[300px] flex justify-between pr-4">
                               <label className="text-[15px] font-bold text-gray-900">No. of Questions</label>
                               <label className="text-[15px] font-bold text-gray-900 mr-2">Marks</label>
                          </div>
                      </div>
                      
                      <div className="space-y-4">
                          {questionTypes.map((qt, index) => (
                              <div key={index} className="flex items-center gap-5">
                                  {/* Select block */}
                                  <div className="relative flex-1">
                                      <select 
                                         value={qt.type}
                                         onChange={e => handleUpdateQuestionType(index, 'type', e.target.value)}
                                         className="w-full appearance-none bg-white border border-white rounded-full py-3.5 px-6 text-[15px] font-medium text-gray-800 focus:outline-none focus:border-gray-300 shadow-sm cursor-pointer"
                                      >
                                          <option value="Multiple Choice Questions">Multiple Choice Questions</option>
                                          <option value="Short Questions">Short Questions</option>
                                          <option value="Diagram/Graph-Based Questions">Diagram/Graph-Based Questions</option>
                                          <option value="Numerical Problems">Numerical Problems</option>
                                          <option value="New Custom Type">New Custom Type</option>
                                      </select>
                                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-500 pointer-events-none" />
                                  </div>
                                  
                                  <button onClick={() => handleRemoveQuestionType(index)} className="text-gray-500 hover:text-gray-800 transition-colors p-1">
                                      <X className="w-5 h-5" strokeWidth={1.5} />
                                  </button>
                                  
                                  <div className="flex gap-10 pl-2">
                                      {/* No of Questions Input with +/- */}
                                      <div className="flex items-center justify-between w-[100px] bg-white rounded-full px-2 py-2 shadow-sm border border-white focus-within:border-gray-300">
                                          <button type="button" onClick={() => decrementValue(index, 'count')} className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-gray-600 transition-colors"><Minus className="w-[18px] h-[18px]" strokeWidth={2} /></button>
                                          <span className="font-bold text-[15px] text-gray-800 w-8 text-center">{qt.count}</span>
                                          <button type="button" onClick={() => incrementValue(index, 'count')} className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-gray-600 transition-colors"><Plus className="w-[18px] h-[18px]" strokeWidth={2} /></button>
                                      </div>
                                      
                                      {/* Marks Input with +/- */}
                                      <div className="flex items-center justify-between w-[100px] bg-white rounded-full px-2 py-2 shadow-sm border border-white focus-within:border-gray-300">
                                          <button type="button" onClick={() => decrementValue(index, 'marks')} className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-gray-600 transition-colors"><Minus className="w-[18px] h-[18px]" strokeWidth={2} /></button>
                                          <span className="font-bold text-[15px] text-gray-800 w-8 text-center">{qt.marks}</span>
                                          <button type="button" onClick={() => incrementValue(index, 'marks')} className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-gray-600 transition-colors"><Plus className="w-[18px] h-[18px]" strokeWidth={2} /></button>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                      
                      {/* Add Question Button */}
                      <button type="button" onClick={handleAddQuestionType} className="flex items-center gap-3 text-[15px] font-bold text-gray-900 mt-6 hover:text-black transition-colors group ml-1">
                          <div className="w-7 h-7 bg-[#2D2D2D] rounded-full flex items-center justify-center text-white group-hover:bg-black transition-colors">
                              <Plus className="w-4 h-4" />
                          </div>
                          Add Question Type
                      </button>
                      
                      {/* Summary */}
                      <div className="flex flex-col items-end mt-8 text-[15px] text-gray-900 space-y-1.5 pr-2">
                          <div>Total Questions : <span className="font-bold ml-1">{totalQuestions}</span></div>
                          <div>Total Marks : <span className="font-bold ml-1">{totalMarks}</span></div>
                      </div>
                  </div>
  
                  {/* Additional Information */}
                  <div>
                      <label className="block text-[15px] font-bold text-gray-900 mb-3 ml-1">Additional Information (For better output)</label>
                      <div className="relative">
                          <textarea 
                             value={instructions}
                             onChange={e => setInstructions(e.target.value)}
                             placeholder="e.g Generate a question paper for 3 hour exam duration..."
                             className="w-full bg-[#fcfcfc] border border-gray-200 rounded-3xl p-5 h-36 text-[15px] text-gray-800 placeholder:text-gray-400 resize-none focus:outline-none focus:border-gray-400 transition-colors hover:border-gray-300"
                          ></textarea>
                          <button type="button" className="absolute bottom-5 right-5 w-9 h-9 flex items-center justify-center rounded-full bg-[#F3F4F6] text-gray-700 hover:bg-gray-200 transition-colors active:scale-95">
                               <Mic className="w-[18px] h-[18px]" />
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  
      {/* Fixed Bottom Footer for Buttons */}
      <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-between bg-gradient-to-t from-[#EAEAEA] to-transparent pointer-events-none items-end pb-8">
          <button 
             type="button"
             onClick={() => navigate(-1)}
             className="bg-white text-gray-900 font-semibold text-[15px] px-8 py-3.5 rounded-full flex items-center gap-2.5 shadow-sm border border-gray-200 pointer-events-auto hover:bg-gray-50 transition-colors"
          >
               <ArrowLeft className="w-5 h-5" strokeWidth={2} /> Previous
          </button>
          <button 
             type="button" 
             onClick={handleSubmit}
             disabled={loading}
             className="bg-[#1C1C1C] text-white font-semibold text-[15px] px-8 py-3.5 rounded-full flex items-center gap-2.5 hover:bg-black pointer-events-auto shadow-sm transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
          >
               {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Next'} {!loading && <ArrowRight className="w-5 h-5" strokeWidth={2} />}
          </button>
      </div>
      </>
      )}
    </div>
  );
}
