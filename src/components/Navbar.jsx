import { Search, Bell, Sun, Moon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/slices/themeSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);

  return (
    <header className="h-16 border-b border-app-line-soft bg-app-card/50 backdrop-blur-md flex items-center justify-between px-6 z-10 sticky top-0">
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-md hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-text-muted" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-app-line rounded-full leading-5 bg-app-bg/50 text-text-main placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all"
            placeholder="Search documents or chats..."
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 text-text-muted hover:text-text-main rounded-full hover:bg-app-hover transition-colors"
          title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {mode === 'dark'
            ? <Sun className="w-5 h-5 text-yellow-400" />
            : <Moon className="w-5 h-5 text-indigo-400" />
          }
        </button>

        {/* Notifications */}
        <button className="p-2 text-text-muted hover:text-text-main rounded-full hover:bg-app-hover transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-app-card"></span>
        </button>
      </div>
    </header>
  );
}
