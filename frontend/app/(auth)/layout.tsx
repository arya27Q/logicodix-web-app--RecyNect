export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        {children}
      </div>
    </div>
  );
}

