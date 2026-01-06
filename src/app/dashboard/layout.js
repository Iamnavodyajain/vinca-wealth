import DashboardSidebar from '../../components/DashboardSidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="p-0 px-0 sm:px-0 lg:px-0">
      <div className="max-w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <DashboardSidebar />

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8 px-4 sm:px-6 lg:px-8 pt-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
