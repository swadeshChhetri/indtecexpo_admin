'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { X, Eye } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import { useAuth } from '@/context/AppProvider'


type Message = {
  id: number
  first_name: string
  last_name: string
  email: string
  message: string
  phone: string
  updated_at: string
}


export default function ContactMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([])
  const { authToken } = useAuth();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch('https://tradesfairs.com/indtecexpo/api/contact', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          cache: 'no-store',
        });

        const data = await res.json()
        console.log('Fetched messages:', data) // 🔍 Inspect this
        setMessages(data)
        setFilteredMessages(data)
      } catch (error) {
        console.error('Failed to fetch messages:', error)
      }
    }

    fetchMessages()
  }, [])


  useEffect(() => {
    const lower = searchQuery.toLowerCase()
    const results = messages.filter(msg =>
      (msg.first_name?.toLowerCase() || '').includes(lower) ||
      (msg.last_name?.toLowerCase() || '').includes(lower) ||
      (msg.email?.toLowerCase() || '').includes(lower) ||
      (msg.phone?.toLowerCase() || '').includes(lower)
    )
    setFilteredMessages(results)
  }, [searchQuery, messages])

  const handleView = (msg: Message) => setSelectedMessage(msg)
  const closeModal = () => setSelectedMessage(null)

  const handleDelete = (id: number) => {
    const confirmed = confirm('Are you sure you want to delete this message?')
    if (confirmed) {
      setMessages(prev => prev.filter(msg => msg.id !== id))
    }
  }

  console.log(selectedMessage);
  return (
    <>
      <Sidebar />
      <div className="ml-64 p-4">
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, email or subject..."
            className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <h2 className="text-xl font-semibold mb-4">Contact Messages</h2>

        <div className="overflow-x-auto rounded-xl shadow border bg-white">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Message</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Received On</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map(msg => (
                <tr key={msg.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{msg.first_name} {msg.last_name}</td>
                  <td className="p-3">{msg.email}</td>
                  <td className="p-3 truncate max-w-[9rem]">{msg.message}</td>
                  <td className="p-3 truncate max-w-[9rem]">{msg.phone}</td>
                  <td className="p-3">
                    {msg.updated_at
                      ? format(new Date(msg.updated_at
                      ), 'PPpp') : 'N/A'}
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => handleView(msg)}
                      className="text-blue-600 hover:underline"
                      title="View Full"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="text-red-500 hover:underline"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View Full Modal */}
        {selectedMessage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl max-w-md w-full relative shadow-lg">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                onClick={closeModal}
              >
                <X />
              </button>
              <h3 className="text-lg font-semibold mb-2">Full Message</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {selectedMessage.first_name} {selectedMessage.last_name}</p>
                <p><span className="font-medium">Email:</span> {selectedMessage.email}</p>
                <p><span className="font-medium">Message:</span><br /> {selectedMessage.message}</p>
                <p className="text-gray-500 text-xs">
                  <span className="font-medium">Received:</span>{' '}
                  {selectedMessage.updated_at ? format(new Date(selectedMessage.updated_at), 'PPpp') : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
