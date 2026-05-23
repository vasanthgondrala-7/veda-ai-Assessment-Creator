import { NavLink } from 'react-router-dom';
import { Home, LayoutDashboard, Sparkles, BookOpen, Settings } from 'lucide-react';
import { useStore } from '../store/useStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Sidebar() {
  const { isSidebarOpen } = useStore();

  const navItems = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Assignments', path: '/assignments', icon: LayoutDashboard },
    { name: 'AI Teacher (Beta)', path: '/ai-teacher', icon: Sparkles },
    { name: 'My Library', path: '/library', icon: BookOpen },
  ];

  return (
    <aside 
      className={cn(
        "relative flex flex-col bg-white border-r border-[#E5E7EB] transition-all duration-300 z-20",
        isSidebarOpen ? "w-[260px]" : "w-[80px]"
      )}
    >
      <div className="h-[72px] flex items-center justify-center px-6 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3 w-full">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 text-white font-bold">
            V
          </div>
          {isSidebarOpen && <span className="text-xl font-bold text-text-main whitespace-nowrap">VedaAI</span>}
        </div>
      </div>

      <nav className="flex-1 py-6 flex flex-col gap-2 px-3">
        <NavLink 
          to="/assignments/new"
          className={cn(
            "flex items-center justify-center gap-3 px-3 py-3 rounded-full mb-6 font-medium transition-colors whitespace-nowrap shadow-sm",
            "bg-gray-900 text-white hover:bg-gray-800"
          )}
        >
          <span className="text-lg leading-none mb-0.5">+</span>
          {isSidebarOpen && "Create Assignment"}
        </NavLink>

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-full font-medium transition-colors whitespace-nowrap",
              isActive 
                ? "bg-primary/10 text-primary" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <item.icon size={20} className={cn("flex-shrink-0", ({isActive}: any) => isActive ? "text-primary" : "text-gray-500")} />
            {isSidebarOpen && item.name}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-6">
        <div className="space-y-1 mb-6">
           <a className="flex items-center gap-3 px-4 py-3 rounded-full text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors whitespace-nowrap cursor-pointer">
              <Settings size={20} className="flex-shrink-0 text-gray-500" />
              {isSidebarOpen && <span className="font-medium">Settings</span>}
           </a>
        </div>

        <div className={cn(
          "flex items-center gap-3 px-4 py-2 transition-all",
          isSidebarOpen ? "" : "justify-center"
        )}>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-gray-200 flex-shrink-0 flex items-center justify-center">
            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=John" alt="User" className="w-full h-full object-cover" />
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-semibold text-gray-900 truncate">Sagar K.</span>
              <span className="text-xs text-gray-500 truncate">sagar@vedaai.com</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

// Trigger git sync
