'use client';
import { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../Navbar/page';

const FileUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    filename: null,
    size: '',
    type: '',
    passcode: '',
    isEncrypted: false,
    permissions: {
      read: false,
      write: false,
      delete: false,
    },
    isShareable: false,
  });
  
  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'file') {
      const selectedFile = files[0];

      // File type validation (only PDF allowed in this case)
      if (selectedFile && selectedFile.type !== 'application/pdf') {
        toast.error('Only PDF files are allowed.');
        return;
      }

      setFormData({
        ...formData,
        filename: selectedFile,
        size: selectedFile.size,
        type: selectedFile.type,
      });
    } else if (type === 'checkbox') {
      if (name.startsWith('permissions')) {
        const permissionType = name.split('_')[1]; // Get the permission type from the name
        setFormData((prevData) => ({
          ...prevData,
          permissions: {
            ...prevData.permissions,
            [permissionType]: checked,
          },
        }));
      } else {
        setFormData({
          ...formData,
          [name]: checked,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    data.append('title', formData.title);
    data.append('file', formData.filename);
    data.append('passcode', formData.passcode);
    data.append('isEncrypted', formData.isEncrypted);
    data.append('isShareable', formData.isShareable);

    // Append permissions to FormData
    for (const key in formData.permissions) {
      if (formData.permissions[key]) {
        data.append('permissions', key); // Changed from 'permissions[]' to 'permissions'
      }
    }

    try {
      const token = localStorage.getItem('token');
      setLoading(true); // Start loading
      const response = await axios.post('http://localhost:4000/api/v1/file/post', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Show success toast
      toast.success('File uploaded successfully!');
      console.log('File uploaded:', response.data);
      
      // Reset the form after successful upload
      resetForm();
    } catch (error) {
      // Show error toast
      toast.error('Error uploading file: ' + (error.response ? error.response.data : error.message));
      console.error('Error uploading file:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      filename: null,
      size: '',
      type: '',
      passcode: '',
      isEncrypted: false,
      permissions: {
        read: false,
        write: false,
        delete: false,
      },
      isShareable: false,
    });
  };

  return (
    <>
    <Navbar/>
    <div className="flex items-center justify-center min-h-screen">
      <ToastContainer /> {/* Add ToastContainer here */}
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-md shadow-xs border border-gray-300">
        <h2 className="text-3xl font-bold text-center text-gray-800">Upload New File</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              required
              value={formData.title} 
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500" 
            />
          </div>

          {/* File Input */}
          <div>
            <label htmlFor="filename" className="block text-sm font-medium text-gray-700">Choose File</label>
            <input 
              type="file" 
              id="filename" 
              name="filename" 
              required
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500" 
            />
          </div>

          {/* Passcode (Optional) */}
          <div>
            <label htmlFor="passcode" className="block text-sm font-medium text-gray-700">Passcode (Optional)</label>
            <input 
              type="text" 
              id="passcode" 
              name="passcode" 
              value={formData.passcode} 
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500" 
            />
          </div>

          {/* Encryption Toggle */}
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="isEncrypted" 
              name="isEncrypted" 
              checked={formData.isEncrypted} 
              onChange={handleChange} 
              className="mr-2" 
            />
            <label htmlFor="isEncrypted" className="text-sm font-medium text-gray-700">Encrypt File</label>
          </div>

          {/* Permissions (Checkboxes) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Permissions</label>
            <div className="flex items-center space-x-4 mt-2">
              <div>
                <input 
                  type="checkbox" 
                  id="permissions_read" 
                  name="permissions_read" 
                  checked={formData.permissions.read} 
                  onChange={handleChange} 
                  className="mr-2" 
                />
                <label htmlFor="permissions_read" className="text-sm">Read</label>
              </div>
              <div>
                <input 
                  type="checkbox" 
                  id="permissions_write" 
                  name="permissions_write" 
                  checked={formData.permissions.write} 
                  onChange={handleChange} 
                  className="mr-2" 
                />
                <label htmlFor="permissions_write" className="text-sm">Write</label>
              </div>
              <div>
                <input 
                  type="checkbox" 
                  id="permissions_delete" 
                  name="permissions_delete" 
                  checked={formData.permissions.delete} 
                  onChange={handleChange} 
                  className="mr-2" 
                />
                <label htmlFor="permissions_delete" className="text-sm">Delete</label>
              </div>
            </div>
          </div>

          {/* Shareable Toggle */}
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="isShareable" 
              name="isShareable" 
              checked={formData.isShareable} 
              onChange={handleChange} 
              className="mr-2" 
            />
            <label htmlFor="isShareable" className="text-sm font-medium text-gray-700">Enable Shareable Link</label>
          </div>

          {/* Submit Button */}
          <div>
            <button 
              type="submit" 
              disabled={loading} // Disable button while loading
              className={`w-full ${loading ? 'bg-gray-400' : 'bg-black'} text-white font-semibold py-3 rounded-lg hover:bg-indigo-600 transition`}
            >
              {loading ? 'Uploading...' : 'Upload File'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default FileUpload;
