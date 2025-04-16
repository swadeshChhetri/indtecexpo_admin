'use client';

import Sidebar from '@/components/Sidebar';
// import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AppProvider';
import { Eye, Pencil, X } from "lucide-react";



type Booking = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  company: string;
  created_at: string;
  stall: string;
  requestedOn: string;
  status: 'Pending' | 'Booked' | 'Rejected';
  designation: string;
  heard_from: string;
  categories: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  address: string;
  street: string;
};

const statusTabs: ('All' | 'Pending' | 'Booked' | 'Rejected')[] = [
  'All',
  'Pending',
  'Booked',
  'Rejected',
];

export default function StallBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Booked' | 'Rejected'>(
    'All'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { authToken } = useAuth();


  useEffect(() => {
    const fetchUsers = async () => {
      try {

        const res = await fetch('http://127.0.0.1:8000/api/spacebooking', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          cache: 'no-store',
        });
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
      // finally {
      // setLoading(false);
      // }
    };

    fetchUsers();
  }, []);


  const handleStatusChange = (id: number, status: 'Booked' | 'Rejected') => {
    const updated = bookings.map((booking) =>
      booking.id === id ? { ...booking, status } : booking
    );
    setBookings(updated);
  };

  const filteredBookings =
    bookings.filter((b) => {
      const matchesStatus =
        filterStatus === 'All' || b.status.toLowerCase() === filterStatus.toLowerCase();
      const matchesSearch = [b.full_name, b.email, b.stall]
        .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesStatus && matchesSearch;
    });

  console.log(filteredBookings);

  const updateBookingStatus = async (id: number, newStatus: 'Booked' | 'Rejected' | 'Pending') => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/spacebooking/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: 'application/json',
          },
        }
      );

      const updatedBookings = bookings.map((booking) =>
        booking.id === id ? { ...booking, status: newStatus } : booking
      );
      setBookings(updatedBookings);
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };


  return (
    <>
      <Sidebar />
      <div className="ml-64 p-6">
        <h1 className="text-2xl font-semibold mb-4">Stall Booking Requests</h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          {statusTabs.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-1 text-sm rounded-full border ${filterStatus === status
                ? 'bg-blue-600 text-white border-blue-600'
                : 'text-gray-600 border-gray-300 hover:bg-gray-100'
                }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by name, email, or stall..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm w-full md:w-64"
        />



        {/* Booking Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto mt-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Booking ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email / Phone</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Company</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Requested On</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-4 py-3">{booking.id}</td>
                  <td className="px-4 py-3">{booking.full_name}</td>
                  <td className="px-4 py-3">
                    {booking.email}
                    <br />
                    <span className="text-sm text-gray-500">{booking.phone}</span>
                  </td>
                  <td className="px-4 py-3">{booking.company}</td>
                  <td className="px-4 py-3">{new Date(booking.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${booking.status === 'Booked'
                        ? 'bg-green-100 text-green-600'
                        : booking.status === 'Rejected'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-yellow-100 text-yellow-600'
                        }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    {booking.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'Booked')}
                          className="text-green-600 hover:underline text-sm"
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'Rejected')}
                          className="text-red-600 hover:underline text-sm"
                        >
                          ❌ Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {showModal && selectedBooking && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-xl max-w-2xl w-full shadow-lg relative">
                          <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <p><strong>Name:</strong> {selectedBooking.full_name}</p>
                            <p><strong>Email:</strong> {selectedBooking.email}</p>
                            <p><strong>Phone:</strong> {selectedBooking.phone}</p>
                            <p><strong>Company:</strong> {selectedBooking.company}</p>
                            <p><strong>Designation:</strong> {selectedBooking.designation}</p>
                            <p><strong>Heard From:</strong> {selectedBooking.heard_from}</p>
                            <p><strong>Categories:</strong> {selectedBooking.categories}</p>
                            <p><strong>Status:</strong> {selectedBooking.status}</p>
                            <p><strong>City:</strong> {selectedBooking.city}</p>
                            <p><strong>State:</strong> {selectedBooking.state}</p>
                            <p><strong>Country:</strong> {selectedBooking.country}</p>
                            <p><strong>Zip:</strong> {selectedBooking.zip}</p>
                            <p className="col-span-2"><strong>Address:</strong> {selectedBooking.address}</p>
                            <p className="col-span-2"><strong>Street:</strong> {selectedBooking.street}</p>
                          </div>
                          <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-2 right-3 text-gray-500 hover:text-black"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowEditModal(true);
                      }}
                      className="text-green-600 hover:underline ml-3"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    {showEditModal && selectedBooking && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-xl max-w-xl w-full shadow-lg relative">
                          <h2 className="text-xl font-semibold mb-4">Update Booking Status</h2>
                          <div className="space-y-4">
                            <p><strong>Name:</strong> {selectedBooking.full_name}</p>
                            <div>
                              <label className="block font-medium mb-1">Status</label>
                              <select
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                value={selectedBooking.status}
                                onChange={(e) => {
                                  if (selectedBooking) {
                                    setSelectedBooking({
                                      ...selectedBooking,
                                      status: e.target.value as Booking['status'],
                                    });
                                  }
                                }}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Booked">Booked</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                            </div>
                          </div>
                          <div className="mt-6 flex justify-end space-x-3">
                            <button
                              onClick={() => {
                                updateBookingStatus(selectedBooking.id, selectedBooking.status);
                                setShowEditModal(false);
                              }}
                              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                              💾 Save
                            </button>
                            <button
                              onClick={() => setShowEditModal(false)}
                              className="text-gray-600 hover:text-black"
                            >
                              ✖ Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-400">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

