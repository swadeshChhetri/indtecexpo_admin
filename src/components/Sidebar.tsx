
// app/dashboard/page.tsx (or wherever you're routing this page)

'use client'
import React from 'react'
import { motion } from 'framer-motion';
import {
  Mail,
  LayoutDashboard,
  Users,
  Store,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AppProvider';




const navLinks = [
  {
    name: 'Dashboard',
    icon: <LayoutDashboard size={20} />,
    href: '/',
  },
  {
    name: 'Visitors/Exhibitors',
    icon: <Users size={20} />,
    href: '/visitor&exhibitor',
  },
  {
    name: 'Stall Bookings',
    icon: <Store size={20} />,
    href: '/stallBooking',
  },
  {
    name: 'Messages',
    icon: <Mail size={20} />,
    href: '/contactMessages',
  },
];


const Sidebar = () => {
  const { logout } = useAuth();
  const pathname = usePathname();

  return (
    <aside className="w-full sm:w-64 h-screen bg-white shadow-lg fixed top-0 left-0 z-20">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">INDTEC EXPO</h1>
      </div>
      <nav className="flex flex-col gap-2 px-4">
        {navLinks.map((link, index) => {
          const isActive = pathname === link.href;

          return (
            <motion.div
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${isActive
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {link.icon}
                {link.name}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <div className="mt-auto p-4">
        <button
          onClick={logout}
          className="flex items-center gap-3 text-red-500 hover:bg-red-50 w-full px-4 py-2 rounded-lg font-medium transition">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar