'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const features = [
    {
      id: 'financial-readiness',
      label: 'Financial Readiness',
      path: '/dashboard/financial-readiness',
      icon: '📊'
    },
    {
      id: 'blind-spot',
      label: 'Blind Spot',
      path: '/dashboard/blind-spot',
      icon: '🔍'
    },
    {
      id: 'talk-to-manager',
      label: 'Talk to Manager',
      path: '/dashboard/talk-to-manager',
      icon: '💬'
    },
    {
      id: 'top-deals',
      label: 'Top Deals',
      path: '/dashboard/top-deals',
      icon: '⭐'
    }
  ];

  const isActive = (path) => {
    return pathname === path;
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className="h-screen sticky top-0">
      <div className="card h-full flex flex-col py-6 mr-2 rounded-none">
        <div className="px-4 mb-4">
          <button
            onClick={() => handleNavigation('/dashboard/profile')}
            className={`w-full text-left px-3 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
              isActive('/dashboard/profile') ? 'bg-green-500 text-white font-medium' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-lg text-slate-700">👤</div>
            <div>
              <div className="text-sm font-medium">Your Profile</div>
              <div className="text-xs text-slate-500">View account</div>
            </div>
          </button>
        </div>

        <div className="px-4 mb-4">
          <h3 className="text-sm font-semibold text-slate-700">Features</h3>
        </div>

        <nav className="space-y-2 px-2 flex-1">
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => handleNavigation(feature.path)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                isActive(feature.path)
                  ? 'bg-green-500 text-white font-medium'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="text-lg">{feature.icon}</span>
              <span className="text-sm">{feature.label}</span>
            </button>
          ))}
        </nav>

        <div className="px-4 pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500">v1.0</p>
        </div>
      </div>
    </div>
  );
}
