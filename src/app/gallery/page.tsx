'use client'

import { useState, useMemo } from 'react'
import { UploadCloud, Trash2, ImageIcon, VideoIcon, CalendarDays } from 'lucide-react';

type MediaItem = {
  id: number
  url: string
  type: 'image' | 'video'
  uploadedAt: string
}

// const initialMedia: MediaItem[] = [
//   {
//     id: 1,
//     url: '/sample1.jpg',
//     type: 'image',
//     uploadedAt: '2025-04-10',
//   },
//   {
//     id: 2,
//     url: '/sample2.mp4',
//     type: 'video',
//     uploadedAt: '2025-04-09',
//   },
//   {
//     id: 3,
//     url: '/sample3.jpg',
//     type: 'image',
//     uploadedAt: '2025-04-11',
//   },
// ]

export default function UploadMedia() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [mediaList, setMediaList] = useState<MediaItem[]>([
    {
      id: 1,
      url: '/sample1.jpg',
      type: 'image',
      uploadedAt: '2025-04-10',
    },
    {
      id: 2,
      url: '/sample2.mp4',
      type: 'video',
      uploadedAt: '2025-04-09',
    },
  ]);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    const valid = selected.filter(file =>
      file.type.startsWith('image/') || file.type.startsWith('video/')
    )
    setFiles(valid)

    // Optional: Generate previews
    const previewURLs = valid.map(file => URL.createObjectURL(file))
    setPreviews(previewURLs)
  }

  const handleUpload = () => {
    alert(`${files.length} files ready for upload`);
    setFiles([]);
    setPreviews([]);
  }

  const handleDelete = (id: number) => {
    const confirmed = confirm('Are you sure you want to delete this item?')
    if (confirmed) {
      setMediaList(prev => prev.filter(item => item.id !== id))
    }
  }

  const filteredMedia = useMemo(() => {
    const filtered = filter === 'all' ? mediaList : mediaList.filter(m => m.type === filter)
    return [...filtered].sort((a, b) =>
      sortOrder === 'newest'
        ? new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        : new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
    )
  }, [mediaList, filter, sortOrder])

  return (
    <>
      <div className="p-4 border rounded-xl bg-white shadow-sm space-y-4">
        <label
          htmlFor="media-upload"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer w-fit"
        >
          <UploadCloud className="w-5 h-5" />
          Upload Photos/Videos
        </label>
        <input
          id="media-upload"
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {previews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {previews.map((url, index) => (
              <div key={index} className="border rounded-md overflow-hidden">
                {files[index].type.startsWith('image/') ? (
                  <img src={url} alt={`Preview ${index}`} className="w-full h-32 object-cover" />
                ) : (
                  <video controls className="w-full h-32 object-cover">
                    <source src={url} type={files[index].type} />
                    Your browser does not support video.
                  </video>
                )}
              </div>
            ))}
          </div>
        )}

        {files.length > 0 && (
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-green-600 text-white rounded-md"
          >
            Upload {files.length} File(s)
          </button>
        )}
      </div>
      <div className="flex items-center justify-between my-4 flex-wrap gap-2">
        <div className="flex gap-2 items-center">
          <span className="font-medium">Filter by:</span>
          <button onClick={() => setFilter('all')} className={`px-2 py-1 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>All</button>
          <button onClick={() => setFilter('image')} className={`px-2 py-1 rounded ${filter === 'image' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Images</button>
          <button onClick={() => setFilter('video')} className={`px-2 py-1 rounded ${filter === 'video' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Videos</button>
        </div>
        <div className="flex gap-2 items-center">
          <span className="font-medium">Sort by:</span>
          <button onClick={() => setSortOrder('newest')} className={`px-2 py-1 rounded ${sortOrder === 'newest' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>Newest</button>
          <button onClick={() => setSortOrder('oldest')} className={`px-2 py-1 rounded ${sortOrder === 'oldest' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>Oldest</button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMedia.map(item => (
          <div
            key={item.id}
            className="relative border rounded-xl overflow-hidden shadow-sm group"
          >
            {item.type === 'image' ? (
              <img src={item.url} alt="media" className="w-full h-40 object-cover" />
            ) : (
              <video src={item.url} controls className="w-full h-40 object-cover" />
            )}

            {/* Media Info */}
            <div className="flex items-center justify-between px-2 py-1 text-sm bg-gray-100">
              <div className="flex items-center gap-1">
                {item.type === 'image' ? (
                  <ImageIcon className="w-4 h-4 text-blue-500" />
                ) : (
                  <VideoIcon className="w-4 h-4 text-red-500" />
                )}
                {item.type}
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <CalendarDays className="w-4 h-4" />
                <span>{item.uploadedAt}</span>
              </div>
            </div>

            {/* Delete Button */}
            <button
              onClick={() => handleDelete(item.id)}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-600 hover:text-white transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
