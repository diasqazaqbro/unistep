"use client";

import { useEffect, useState } from "react";
import type React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  FileEdit,
  InboxIcon,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSession } from "@/hooks/use-session";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/site", label: "Site Settings", icon: FileEdit },
    { href: "/dashboard/applications", label: "Applications", icon: InboxIcon },
  ];

  const { isLoggedIn, isLoading, clearSession } = useSession();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, isLoading, router]);

  if (isLoading || !isLoggedIn) return null;

  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r bg-white hidden md:block">
        <Link href="/" className="flex h-16 items-center border-b px-6">
          <span className="text-xl font-bold text-red-600">UniStep</span>
        </Link>
        <nav className="space-y-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all hover:bg-red-50"
            >
              <item.icon className="h-5 w-5 text-gray-500" />
              <span>{item.label}</span>
            </Link>
          ))}
          <div className="pt-4 mt-4 border-t">
            <div
              onClick={clearSession}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all hover:bg-red-50 cursor-pointer"
            >
              <LogOut className="h-5 w-5 text-gray-500" />
              <span>Log out</span>
            </div>
          </div>
        </nav>
      </aside>

      {/* Mobile header with Sheet for navigation */}
      <div className="flex flex-col flex-1">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-4 md:hidden">
          <span className="text-xl font-bold text-red-600">UniStep</span>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-16 items-center border-b px-6">
                <span className="text-xl font-bold text-red-600">UniStep</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
              <nav className="space-y-1 p-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all hover:bg-red-50"
                    onClick={() => setOpen(false)}
                  >
                    <item.icon className="h-5 w-5 text-gray-500" />
                    <span>{item.label}</span>
                  </Link>
                ))}
                <div className="pt-4 mt-4 border-t">
                  <div
                    onClick={() => {
                      clearSession();
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all hover:bg-red-50 cursor-pointer"
                  >
                    <LogOut className="h-5 w-5 text-gray-500" />
                    <span>Log out</span>
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
