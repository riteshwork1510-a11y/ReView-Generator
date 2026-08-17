
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <main className="flex-1 h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}