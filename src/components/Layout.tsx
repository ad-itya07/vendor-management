"use client";

import type React from "react";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn, user } = useUser();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="text-xl font-bold text-gray-800">
                Vendor Management
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {isSignedIn ? (
                <>
                  <Link
                    href="/vendors"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    My Vendors
                  </Link>
                  {user?.publicMetadata?.role === "admin" && (
                    <Link
                      href="/admin/vendors"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {user?.primaryEmailAddress?.emailAddress}
                    </span>
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </>
              ) : (
                <SignInButton>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Sign In
                  </button>
                </SignInButton>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Vendor Management System
        </div>
      </footer>
    </div>
  );
};

export default Layout;
