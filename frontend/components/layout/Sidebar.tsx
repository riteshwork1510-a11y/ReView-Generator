'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Settings, Star, Clock, Menu, X, Contact } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Reusable Sidebar Content Component
function SidebarContent({ pathname }: { pathname: string }) {
  const navItems = [
    { name: "Digital Business Cards", href: "/digital-cards", icon: Contact },
    { name: "Review Generator", href: "/review-generator", icon: FileText },
    { name: "Review History", href: "/review-history", icon: Clock },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      <div className="h-14 md:h-16 flex items-center px-6 border-b border-stone-200/60 shrink-0">
        <div className="font-bold text-xl text-stone-800 flex items-center gap-2">
          <Star className="w-5 h-5 text-indigo-500" />
          ReviewGen
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5">
        <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-3 px-4">
          Main Menu
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-indigo-100/70 text-indigo-600 font-semibold shadow-sm"
                  : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"
              )}
            >
              <item.icon className={cn(
                "w-4.5 h-4.5 shrink-0 transition-colors",
                isActive ? "text-indigo-500" : "text-stone-400"
              )} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
  }, [pathname]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
      // Lock body scroll
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between h-14 px-4 border-b border-stone-200/60 bg-[#FAF9F6] shrink-0">
        <div className="font-bold text-lg text-stone-800 flex items-center gap-2">
          <Star className="w-5 h-5 text-indigo-500" />
          ReviewGen
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} aria-label="Open Menu" className="text-stone-500 hover:bg-stone-100">
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-stone-200/60 bg-[#FAF9F6] flex-col h-screen shrink-0">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile Drawer Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-stone-900/40 z-40 md:hidden transition-opacity duration-200",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 w-64 bg-[#FAF9F6] flex flex-col z-50 md:hidden transform transition-transform duration-200 ease-in-out shadow-xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="absolute top-3 right-3">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-stone-400 hover:bg-stone-100 hover:text-stone-600" aria-label="Close Menu">
            <X className="w-5 h-5" />
          </Button>
        </div>
        <SidebarContent pathname={pathname} />
      </aside>
    </>
  );
}
