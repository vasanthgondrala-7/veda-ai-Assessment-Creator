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
  updateAssignment: (assignment) => set((state) => ({
    assignments: state.assignments.map(a => a.id === assignment.id ? assignment : a)
  })),
  setCachedPaper: (id, paper) => set((state) => ({
    cachedPapers: { ...state.cachedPapers, [id]: paper }
  })),
}));
