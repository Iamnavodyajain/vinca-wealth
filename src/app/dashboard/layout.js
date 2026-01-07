import DashboardSidebar from '../../components/DashboardSidebar';
import { PremiumProvider } from '../../lib/premium';

export default function DashboardLayout({ children }) {
  return (
    <PremiumProvider>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar Navigation */}
        <div className="hidden lg:block flex-shrink-0">
          <DashboardSidebar />
        </div>

        {/* Mobile Sidebar is rendered by DashboardSidebar component */}
        
        {/* Main Content Area */}
        <div className="flex-1 min-h-0 overflow-auto">
          <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-8 min-h-0">
            {/* Mobile header spacing */}
            <div className="lg:hidden h-12"></div>
            {children}
          </div>
        </div>
      </div>
    </PremiumProvider>
  );
}