function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Background blobs for consistency with LoginPage */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 bg-slate-900 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
