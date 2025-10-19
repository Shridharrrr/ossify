"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  MagnifyingGlassIcon,
  BookmarkIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import {
  MagnifyingGlassIcon as MagnifyingGlassSolid,
  BookmarkIcon as BookmarkSolid,
  UserIcon as UserSolid,
} from "@heroicons/react/24/solid";
import { Domine } from "next/font/google";

const domine = Domine({
  subsets: ["latin"],
  weight: "400",
});

const navigation = [
  {
    name: "Discover",
    href: "/discover",
    icon: MagnifyingGlassIcon,
    activeIcon: MagnifyingGlassSolid,
  },
  {
    name: "Saved Repos",
    href: "/saved",
    icon: BookmarkIcon,
    activeIcon: BookmarkSolid,
  },
  { 
    name: "Profile", 
    href: "/profile", 
    icon: UserIcon, 
    activeIcon: UserSolid 
  },
];

export default function AppSidebar({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-black opacity-70"
          onClick={() => setSidebarOpen(false)}
        ></div>

        {/* Mobile sidebar - now with desktop styling */}
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-black border-r border-black/85 shadow-lg transform transition-transform duration-300">
          <div className="flex items-center justify-between h-16 px-6 border-b border-black/85">
            <h2 className={`text-2xl ${domine.className} text-white font-bold`}>
              Oss<span className="text-neutral-400">ify</span>
            </h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-neutral-400 hover:text-white hover:bg-black/90 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = isActive ? item.activeIcon : item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    borderImage: isActive 
                      ? "conic-gradient(#d4d4d4 0deg, #171717 90deg, #d4d4d4 180deg, #171717 270deg, #d4d4d4 360deg) 1"
                      : "none",
                  }}
                  className={`flex items-center px-3 py-2 text-sm font-medium w-full transition-all duration-300 ${
                    isActive
                      ? "bg-black text-white font-medium border-[1px]"
                      : "text-neutral-400 hover:bg-black/90 hover:text-white"
                  } rounded-lg`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile user section - with desktop styling */}
          <div className="border-t border-black/85 px-4 py-4">
            <div className="flex items-center mb-4">
              {user?.photoURL && (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="h-8 w-8 rounded-full mr-3"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.displayName}
                </p>
                <p className="text-xs text-neutral-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-neutral-400 hover:bg-black/90 hover:text-white transition-colors rounded-lg"
            >
              <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col border-r border-black/85">
        <div className="flex min-h-0 flex-1 flex-col bg-black">
          <div className="text-center flex justify-center pt-6">
            <h2 className={`text-3xl ${domine.className} text-white font-bold`}>
              Oss<span className="text-neutral-400">ify</span>
            </h2>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = isActive ? item.activeIcon : item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  style={{
                    borderImage: isActive 
                      ? "conic-gradient(#d4d4d4 0deg, #171717 90deg, #d4d4d4 180deg, #171717 270deg, #d4d4d4 360deg) 1"
                      : "none",
                  }}
                  className={`flex items-center px-3 py-2 text-sm font-medium w-full transition-all duration-300 ${
                    isActive
                      ? "bg-black text-white font-medium border-[1px]"
                      : "text-neutral-400 hover:bg-black/90 hover:text-white"
                  } rounded-lg`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop user section */}
          <div className="px-4 py-4">
            <div className="flex items-center mb-4">
              {user?.photoURL && (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="h-8 w-8 rounded-full mr-3"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.displayName}
                </p>
                <p className="text-xs text-neutral-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-neutral-400 hover:bg-black/90 hover:text-white transition-colors rounded-lg"
            >
              <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="lg:pl-64 flex flex-col flex-1 bg-white">
        {/* Top navbar - updated with dark theme */}
        <div className="sticky top-0 z-10 flex lg:hidden h-16 flex-shrink-0 bg-black shadow-sm border-b border-black/85">
          <button
            type="button"
            className="border-r border-black/85 px-4 text-neutral-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="flex flex-1 justify-between px-4 lg:px-6">
            <div className="flex flex-1 items-center">
              <Link
                href="/"
                className="lg:hidden text-2xl font-bold text-white"
              >
                <span className={domine.className}>
                  Oss<span className="text-neutral-400">ify</span>
                </span>
              </Link>
            </div>

            <div className="ml-4 flex items-center lg:hidden">
              {user?.photoURL && (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="h-8 w-8 rounded-full border border-neutral-600"
                />
              )}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 bg-white">{children}</main>
      </div>
    </div>
  );
}