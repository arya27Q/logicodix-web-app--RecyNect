export default function MatchingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen max-w-5xl mx-auto p-4 sm:p-6">
      {children}
    </div>
  );
}

