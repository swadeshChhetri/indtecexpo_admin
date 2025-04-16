// app/dashboard/page.tsx (or wherever you're routing this page)

'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { motion } from 'framer-motion';
import {
  UserPlus, Mail,
  Users,
  Store,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
// import axios from "@/utils/axiosInstance";
import { useAuth } from '@/context/AppProvider';



interface SummaryData {
  total_visitors: number;
  total_exhibitors: number;
  stalls_booked: number;
  messages: number;
}

interface Activity {
  name: string;
  type: 'Visitor' | 'Exhibitor' | 'Message';
  date: string;
}

interface PieItem {
  name: string;
  value: number;
}

interface BarItem {
  date: string;
  stalls: number;
}


const COLORS = ['#3b82f6', '#22c55e']; // Blue, Green


export default function Home() {

  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [pieData, setPieData] = useState<PieItem[]>([]);
  const [barData, setBarData] = useState<BarItem[]>([]);
  const { authToken } = useAuth();



  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/admin/dashboard-charts', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          cache: 'no-store',
        });

        if (!res.ok) throw new Error('Failed to fetch chart data');
        const json = await res.json();
        setPieData(json.pie);
        setBarData(json.bar);
      } catch (err) {
        console.error('Error fetching chart data:', err);
      }
    };

    fetchChartData();
  }, []);


  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/admin/dashboard-summary', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          cache: 'no-store',
        });

        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error('Error fetching summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/admin/recent-activity', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('Failed to fetch activity');
        const json = await res.json();
        console.log(json);
        setActivities(json);
      } catch (error) {
        console.error('Error fetching activity:', error);
      }
    };

    fetchActivities();
  }, []);


  const summaryData = [
    {
      title: 'Total Visitors',
      count: data?.total_visitors ?? 0,
      icon: <Users className="text-blue-500" size={28} />,
      bg: 'bg-blue-100',
    },
    {
      title: 'Total Exhibitors',
      count: data?.total_exhibitors ?? 0,
      icon: <UserPlus className="text-green-500" size={28} />,
      bg: 'bg-green-100',
    },
    {
      title: 'Stalls Booked',
      count: data?.stalls_booked ?? 0,
      icon: <Store className="text-yellow-500" size={28} />,
      bg: 'bg-yellow-100',
    },
    {
      title: 'Messages',
      count: data?.messages ?? 0,
      icon: <Mail className="text-red-500" size={28} />,
      bg: 'bg-red-100',
    },
  ];

  return (
    <>
      <Sidebar />
      {loading ? (
        <p>Loading..</p>
      ) : (
        <section className="ml-64 p-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {summaryData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-2xl p-5 shadow-md flex items-center justify-between ${item.bg}`}
              >
                <div>
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <p className="text-2xl font-bold">{item.count}</p>
                </div>
                <div>{item.icon}</div>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity */}
          <h2 className="text-xl font-semibold mt-10 mb-4">Recent Activity</h2>
          <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((item, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{item.name}</td>
                    <td
                      className={`py-3 px-4 ${item.type === 'Visitor'
                        ? 'text-blue-600'
                        : item.type === 'Exhibitor'
                          ? 'text-green-600'
                          : 'text-red-600'
                        }`}
                    >
                      {item.type}
                    </td>
                    <td className="py-3 px-4 text-gray-500">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Charts Section */}
          <h2 className="text-xl font-semibold mt-10 mb-4">Statistics Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="bg-white rounded-2xl shadow-md p-4">
              <h3 className="text-md font-semibold mb-2">Visitor vs Exhibitor</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="bg-white rounded-2xl shadow-md p-4">
              <h3 className="text-md font-semibold mb-2">Stalls Booked Over Time</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="stalls" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Access Buttons */}
          <h2 className="text-xl font-semibold mt-10 mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => window.location.href = '/visitor&exhibitor'}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Manage Visitors/Exhibitors
            </button>

            <button
              onClick={() => window.location.href = '/stallBooking'}
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl font-semibold transition"
            >
              Approve Stall Bookings
            </button>

            <button
              onClick={() => window.location.href = '/contactMessages'}
              className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition"
            >
              Check Messages
            </button>
          </div>
        </section>
      )}
    </>

  );
}

