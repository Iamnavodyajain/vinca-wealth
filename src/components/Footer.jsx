export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-lg font-semibold text-slate-900">Vinca Wealth</span>
            </div>
            <p className="text-sm text-slate-500 mt-2">
              Empowering your journey to financial freedom
            </p>
          </div>
          
          <div className="text-sm text-slate-500">
            <p>© {new Date().getFullYear()} Vinca Wealth. All rights reserved.</p>
            <p className="mt-1">This is a frontend demonstration tool. For actual financial advice, consult a certified professional.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}