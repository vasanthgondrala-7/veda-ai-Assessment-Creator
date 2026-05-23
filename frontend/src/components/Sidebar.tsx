import { NavLink } from 'react-router-dom';
import { Home, LayoutDashboard, Sparkles, BookOpen, Settings, Users, BookMarked } from 'lucide-react';
import { useStore } from '../store/useStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Sidebar() {
  const { isSidebarOpen } = useStore();

  const navItems = [
    { name: 'Home', path: '/home', icon: LayoutDashboard },
    { name: 'My Groups', path: '/groups', icon: Users },
    { name: 'Assignments', path: '/assignments', icon: BookMarked },
    { name: 'AI Teacher\'s Toolkit', path: '/ai-teacher', icon: Sparkles },
    { name: 'My Library', path: '/library', icon: BookOpen, badge: '32' },
  ];

  return (
    <aside 
      className={cn(
        "relative flex flex-col bg-white transition-all duration-300 z-20 shadow-sm print:hidden",
        isSidebarOpen ? "w-[280px]" : "w-[80px]"
      )}
      style={{ margin: '16px', borderRadius: '16px', height: 'calc(100vh - 32px)', flexShrink: 0 }}
    >
      <div className="h-24 flex items-center px-8 border-b-0">
        <div className="flex items-center gap-3 w-full">
          <div className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-[#E74C3C] to-[#C0392B] flex items-center justify-center flex-shrink-0 text-white font-bold text-xl drop-shadow-sm">
            V
          </div>
          {isSidebarOpen && <span className="text-[22px] font-bold text-gray-900 tracking-tight whitespace-nowrap">VedaAI</span>}
        </div>
      </div>

      <div className="px-6 pb-4">
        <NavLink 
          to="/assignments/new"
          className={cn(
            "flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-full font-medium transition-colors whitespace-nowrap shadow-md",
            "bg-[#2C2C2C] text-white hover:bg-black w-full"
          )}
        >
          <Sparkles size={18} className="text-gray-300" />
          {isSidebarOpen && "Create Assignment"}
        </NavLink>
      </div>

      <nav className="flex-1 py-4 flex flex-col gap-1.5 px-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium transition-colors whitespace-nowrap text-[15px]",
              isActive 
                ? "bg-gray-100 text-gray-900 font-semibold" 
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <item.icon size={20} className={cn("flex-shrink-0", ({isActive}: any) => isActive ? "text-gray-800" : "text-gray-400")} />
            {isSidebarOpen && (
              <div className="flex flex-1 items-center justify-between">
                <span>{item.name}</span>
                {item.badge && (
                  <span className="bg-[#FF5A1F] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 pb-6 mt-auto flex flex-col gap-4">
        <a className="flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-[15px] font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors whitespace-nowrap cursor-pointer">
           <Settings size={20} className="flex-shrink-0 text-gray-400" />
           {isSidebarOpen && <span>Settings</span>}
        </a>

        <div className={cn(
          "flex items-center gap-3 p-3 transition-all bg-[#F4F4F4] rounded-2xl mx-1",
          isSidebarOpen ? "" : "justify-center"
        )}>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-gray-200 flex-shrink-0 flex items-center justify-center">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher" alt="User" className="w-full h-full object-cover" />
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[14px] font-bold text-gray-900 truncate">Delhi Public School</span>
              <span className="text-[12px] text-gray-500 truncate">Bokaro Steel City</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

// Trigger git sync
