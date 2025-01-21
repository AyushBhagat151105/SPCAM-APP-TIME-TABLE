import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Menu from "@/components/menu";
import { FaHome } from "react-icons/fa";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex bg-gray-900">
      {/* LEFT SIDEBAR */}
      <div
        className="
          w-20 lg:w-64
          bg-gray-800 
          border-r border-gray-700
          transition-all
          duration-300
          ease-in-out
          flex
          flex-col
        "
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-center border-b border-gray-700">
          <Link href="/" className="flex items-center justify-center space-x-2">
            <Image
              src="/SPCE-SPCAM.png"
              alt="SPCAM Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-white font-bold text-lg hidden lg:block">
              SPCAM
            </span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <Menu />
      </div>

      {/* RIGHT CONTENT AREA */}
      <div
        className="
          flex-1
          flex
          flex-col
          overflow-hidden
          bg-gradient-to-br
          from-gray-900
          to-gray-800
        "
      >
        {/* Navbar */}
        <Navbar />

        {/* Main Content Area */}
        <main
          className="
            flex-1
            overflow-y-auto
            p-6
            bg-transparent
            scrollbar-thin
            scrollbar-track-gray-800
            scrollbar-thumb-indigo-600
          "
        >
          {children}
        </main>

        {/* Optional Footer */}
        <footer
          className="
            bg-gray-800
            text-gray-300
            p-4
            text-center
            border-t
            border-gray-700
          "
        >
          <div className="flex items-center justify-center space-x-2">
            <FaHome className="text-indigo-400" />
            <span className="text-sm">
              © {new Date().getFullYear()} Sardar Patel College of
              Administration & Management
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
