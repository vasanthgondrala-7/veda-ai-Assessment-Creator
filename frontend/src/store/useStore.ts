import { create } from 'zustand';
import { Assignment, GeneratedPaper } from '../types';

interface StoreState {
  isSidebarOpen: boolean;
  assignments: Assignment[];
  cachedPapers: Record<string, GeneratedPaper>;
  setSidebarOpen: (open: boolean) => void;
  setAssignments: (assignments: Assignment[]) => void;
  updateAssignment: (assignment: Assignment) => void;
  setCachedPaper: (id: string, paper: GeneratedPaper) => void;
}

export const useStore = create<StoreState>((set) => ({
  isSidebarOpen: true,
  assignments: [],
  cachedPapers: {},
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  setAssignments: (assignments) => set({ assignments }),
  updateAssignment: (assignment) => set((state) => {
    const exists = state.assignments.some(a => a.id === assignment.id);
    if (exists) {
      return { assignments: state.assignments.map(a => a.id === assignment.id ? assignment : a) };
    }
    return { assignments: [assignment, ...state.assignments] };
  }),
  setCachedPaper: (id, paper) => set((state) => ({
    cachedPapers: { ...state.cachedPapers, [id]: paper }
  })),
}));
