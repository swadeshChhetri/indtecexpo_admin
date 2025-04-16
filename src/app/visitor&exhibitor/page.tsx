'use client';

import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AppProvider';
import { useState, useEffect } from 'react';


const tabs = ['All', 'Visitors', 'Exhibitors'];

type User = {
  id: number;
  name: string;
  email: string;
  type: 'Visitor' | 'Exhibitor';
  registeredAt: string;
};

export default function VisitorExhibitorPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const { authToken } = useAuth();
  const usersPerPage = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      try {

        const res = await fetch('http://127.0.0.1:8000/api/visitors-exhibitors', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          cache: 'no-store',
        });
        const data = await res.json();
        console.log(data);
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);


  const typeMap: Record<string, string> = {
    Visitors: 'Visitor',
    Exhibitors: 'Exhibitor',
  };
  
  const filteredUsers = activeTab === 'All'
    ? users
    : users.filter((user) => user.type === typeMap[activeTab]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const start = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(start, start + usersPerPage);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1); // reset to first page on tab change
  };

  return (
    <>
    <Sidebar/>
      <div className="ml-64 p-6">
        <h1 className="text-2xl font-semibold mb-6">Visitor & Exhibitor Management</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition
              ${activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
            `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Registered At</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <tr key={`${user.type}-${user.id}`}>
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.type}</td>
                    <td className="px-4 py-3">{user.registeredAt}</td>
                    <td className="px-4 py-3 space-x-2">
                      <button className="text-blue-600 hover:underline text-sm">Edit</button>
                      <button className="text-red-600 hover:underline text-sm">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-400">
                    No {activeTab} found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              Prev
            </button>
            <p className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </p>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}
