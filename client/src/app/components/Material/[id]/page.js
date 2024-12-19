'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaLock, FaUnlock } from 'react-icons/fa';
import axios from 'axios';

const FileDetail = ({ params }) => {
    const [file, setFile] = useState(null);
    const [shareLink, setShareLink] = useState(null); // State to store the shareable link
    const { id } = React.use(params);

    useEffect(() => {
        const fetchFile = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/v1/file/getOneFile/${id}`);
                const data = await response.json();
                console.log('File data:', data);
                setFile(data.file);

                // Automatically call handleShare if the file is shareable
                if (data.file.isShareable) {
                    handleShare(data.file._id);
                }
            } catch (error) {
                console.error('Error fetching file:', error);
                // Optional: Display error message to the user
            }
        };

        if (id) {
            fetchFile();
        }
    }, [id]);

    // Function to handle share action
    const handleShare = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found, user might not be logged in.');
            return;
        }
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}api/v1/file/shareFile/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const link = response.data.link; // Assuming the backend returns the link in response.data.link
            setShareLink(link); // Set the link in the state
        } catch (error) {
            console.error('Error sharing file:', error.response ? error.response.data : error.message);
            // Optional: Display error message to the user
        }
    };

    // Function to handle back action
    const handleBack = () => {
        window.history.back();
    };

    if (!file) {
        return <p>Loading...</p>;
    }

    return (
        <div className="min-h-screen flex justify-center items-center p-8">
            <div className="bg-white p-16 flex flex-col md:flex-row border-2 border-gray-200 rounded-lg shadow-xs w-[150vh]">
                {/* Left side: File preview and details */}
                <div className="md:w-1/2 flex flex-col items-center">
                    <Image src={`${file.filepath}`} alt={`${file.title}`} width={400} height={400} className="rounded-md mb-4" />
                    <button className="text-gray-500 mt-4 font-semibold">{file.title}</button>
                </div>

                {/* Right side: File details and actions */}
                <div className="md:w-1/2 md:ml-8">
                    <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">File Details</p>
                    <h2 className="text-3xl capitalize tracking-normal font-bold mb-4">{file.title}</h2>
                    <div className="flex items-center mb-4">
                        {file.isEncrypted ? (
                            <div className="flex items-center text-red-500">
                                <FaLock className="mr-2" />
                                <span>File is Encrypted</span>
                            </div>
                        ) : (
                            <div className="flex items-center text-green-500">
                                <FaUnlock className="mr-2" />
                                <span>File is Not Encrypted</span>
                            </div>
                        )}
                    </div>
                    <p className="text-gray-600 mb-4">
                        <strong> File Type:</strong> {file.type} <br />
                        <strong> File Size:</strong> {file.size} <br />
                        <strong className="mb-3"> Uploaded on:</strong> {new Date(file.uploadDate).toLocaleDateString()} <br />
                        <strong className="capitalize">{file.permissions.join(' ')}</strong>
                    </p>
                    <div className="text-2xl font-bold text-green-800 mb-6">Actions</div>

                    {/* Conditionally render the shareable link if available */}
                    {shareLink && (
                        <div className="mt-4 max-w-2xl"> {/* Adjusted width here */}
                            <p className="text-sm text-gray-500">Shareable Link:</p>
                            <a href={shareLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline break-all">
                                {shareLink}
                            </a>
                        </div>
                    )}

                    <button className="px-5 py-2 bg-black text-white rounded-md font-regular mt-20" onClick={handleBack}>
                        Go back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FileDetail;
