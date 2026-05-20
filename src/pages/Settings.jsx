import { motion } from 'framer-motion';
import { User, Key, Bell, Palette, Monitor } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../store/slices/themeSlice';

export default function Settings() {
  const dispatch = useDispatch();
  const { mode } = useSelector(state => state.theme);

  const sections = [
    {
      id: 'profile',
      title: 'Profile Settings',
      icon: User,
      description: 'Manage your personal information and account preferences.',
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center border-2 border-secondary/30">
              <User className="w-8 h-8 text-secondary" />
            </div>
            <div>
              <button className="bg-app-line hover:bg-app-line-strong text-text-main px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Change Avatar
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">Full Name</label>
              <input type="text" defaultValue="Alex Designer" className="w-full bg-app-bg/50 border border-app-line rounded-xl px-4 py-2.5 text-text-main focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">Email</label>
              <input type="email" defaultValue="alex@example.com" className="w-full bg-app-bg/50 border border-app-line rounded-xl px-4 py-2.5 text-text-main focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: Palette,
      description: 'Customize how DocChat looks on your device.',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {['light', 'dark', 'system'].map((theme) => (
              <button 
                key={theme} 
                onClick={() => dispatch(setTheme(theme))}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${mode === theme ? 'border-primary bg-primary/10 text-primary' : 'border-app-line hover:border-app-line-strong text-text-muted'}`}>
                <Monitor className="w-6 h-6" />
                <span className="font-medium text-sm capitalize">{theme}</span>
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'api',
      title: 'API Configuration',
      icon: Key,
      description: 'Manage your API keys and model preferences.',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1.5">OpenAI API Key</label>
            <div className="flex gap-2">
              <input type="password" defaultValue="sk-..." className="flex-1 bg-app-bg/50 border border-app-line rounded-xl px-4 py-2.5 text-text-main focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all" />
              <button className="bg-app-line hover:bg-app-line-strong text-text-main px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
                Verify
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1.5">Default Model</label>
            <select className="w-full bg-app-bg/50 border border-app-line rounded-xl px-4 py-2.5 text-text-main focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all appearance-none">
              <option>GPT-4 Turbo</option>
              <option>GPT-3.5 Turbo</option>
              <option>Claude 3 Opus</option>
            </select>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-main mb-2">Settings</h1>
        <p className="text-text-muted">Manage your account settings and preferences.</p>
      </div>

      <div className="space-y-6">
        {sections.map((section, i) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-app-card border border-app-line-soft rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-app-line-soft">
              <div className="w-10 h-10 rounded-lg bg-app-hover flex items-center justify-center">
                <section.icon className="w-5 h-5 text-text-main" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text-main">{section.title}</h2>
                <p className="text-sm text-text-muted">{section.description}</p>
              </div>
            </div>
            {section.content}
          </motion.div>
        ))}

        <div className="flex justify-end gap-4 mt-8">
          <button className="px-6 py-2.5 rounded-xl font-medium text-text-muted hover:text-text-main transition-colors">
            Cancel
          </button>
          <button className="px-6 py-2.5 rounded-xl font-medium bg-primary text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
