'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

const FileDetail = ({ params }) => {
    const { id } = React.use(params);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [shareableLink, setShareableLink] = useState(''); // State for the shareable link

    useEffect(() => {
        const fetchFileDetails = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found, user might not be logged in.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    `http://localhost:4000/api/v1/file/getOneFile/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setFile(response.data.file);
            } catch (err) {
                console.error("Error fetching file details:", err);
                setError(err.response?.data?.message || 'Failed to fetch file details.');
            } finally {
                setLoading(false);
            }
        };

        fetchFileDetails();
    }, [id]);

    const downloadFile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to download files.');
            return;
        }
    
        try {
            const response = await axios.get(
                `http://localhost:4000/api/v1/file/download/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: 'blob', // Set responseType to 'blob'
                }
            );
    
            // Create a URL for the blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const filename = response.headers['content-disposition']
                ? response.headers['content-disposition'].split('filename=')[1].replace(/"/g, '')
                : file.filename || 'downloaded_file';
            link.setAttribute('download', filename); // Set the filename
            document.body.appendChild(link);
            link.click(); // Trigger the download
            link.parentNode.removeChild(link); // Remove the link from the DOM
            window.URL.revokeObjectURL(url); // Clean up the URL object
        } catch (err) {
            console.error("Error downloading file:", err);
            alert(err.response?.data?.message || 'Failed to download file.');
        }
    };
    
    const shareFile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to share files.');
            return;
        }

        try {
            const response = await axios.get(
                `http://localhost:4000/api/v1/file/shareFile/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setShareableLink(response.data.link); // Set the shareable link in state
            alert('File shared successfully! You can copy the link from below.');
        } catch (err) {
            console.error("Error sharing file:", err);
            alert(err.response?.data?.message || 'Failed to share file.');
        }
    };

    const deleteFile = async () => {
        const confirmed = window.confirm('Are you sure you want to delete this file? This action cannot be undone.');
        if (!confirmed) return;

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to delete files.');
            return;
        }

        try {
            await axios.delete(`http://localhost:4000/api/v1/file/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('File deleted successfully!');
            // Optionally, redirect or update the UI after deletion
            // window.location.href = '/files'; // Redirect to a files list page
        } catch (err) {
            console.error("Error deleting file:", err);
            alert(err.response?.data?.message || 'Failed to delete file.');
        }
    };

    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
    if (!file) return <p className="text-center mt-10">No file found with this ID.</p>;

    return (
        <div className="p-10 bg-gray-100 min-h-screen">
            <h1 className="text-4xl font-light mb-4 text-gray-800">{file.title}</h1>
            <div className="mb-6">
                <p><strong>Filename:</strong> {file.filename}</p>
                <p><strong>Upload Date:</strong> {new Date(file.uploadDate).toLocaleDateString()}</p>
                <p><strong>Size:</strong> {file.size} bytes</p>
                <p><strong>Type:</strong> {file.type}</p>
                <p><strong>Shareable:</strong> {file.isShareable ? 'Yes' : 'No'}</p>
                <div>
                    {file.isEncrypted ? (
                        <p>This file is encrypted. Please contact support for access.</p>
                    ) : (
                        <p>This file is not encrypted.</p>
                    )}
                </div>
            </div>

            {file.type.startsWith('image/') ? (
                <Image
                    height={500}
                    width={500}
                    src={`${file.filepath}`}
                    alt={file.filename}
                    className="mt-4 max-w-full h-auto rounded shadow"
                />
            ) : file.type === 'application/pdf' ? (
                <iframe 
                    src={`${file.filepath}`} 
                    title="PDF Document" 
                    className="mt-4 w-full h-96 border border-gray-300 rounded"
                />
            ) : (
                <p className="mt-4">File type not supported for preview.</p>
            )}

            <div className="mt-6 flex space-x-4">
                <button
                    className="px-4 py-2 bg-indigo-700 text-white rounded hover:bg-indigo-600 transition"
                    onClick={downloadFile}
                >
                    Download File
                </button>
                <button
                    className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-600 transition"
                    onClick={shareFile}
                >
                    Share File
                </button>
                <button
                    className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-600 transition"
                    onClick={deleteFile}
                >
                    Delete File
                </button>
            </div>

            {shareableLink && ( // Display the shareable link if available
                <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
                    <strong>Shareable Link:</strong>
                    <p className="text-gray-700">{shareableLink}</p>
                </div>
            )}
        </div>
    );
};

export default FileDetail;
