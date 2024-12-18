'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import Card from '../../components/Card/page';
import Navbar from '../Navbar/page';
import { FaFileUpload } from 'react-icons/fa';

const Page = () => {
    const [files, setFiles] = useState([]);
    const [passcodes, setPasscodes] = useState({});
    const router = useRouter();
    const [shareLinks, setShareLinks] = useState({}); // New state to store shared links


    useEffect(() => {
        const fetchFiles = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found, user might not be logged in.');
                return;
            }
            try {
                const response = await axios.get('http://localhost:4000/api/v1/file', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFiles(response.data.files);
            } catch (error) {
                console.error('Error fetching files:', error.response ? error.response.data : error.message);
            }
        };

        fetchFiles();
    }, []);

    const handleDownload = async (filename) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found, user might not be logged in.');
            return;
        }
    
        try {
            const response = await axios.get(`http://localhost:4000/api/v1/file/download/${filename}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'blob', // Use blob to handle various file types
            });
    
            // Create a URL for the downloaded blob
            const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
            
            // Create a temporary link element
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename); // Ensure filename includes the extension
            document.body.appendChild(link);
    
            // Trigger the download
            link.click();
    
            // Clean up the link and URL object
            link.remove();
            window.URL.revokeObjectURL(url);
    
            toast.success('File downloaded successfully!');
        } catch (error) {
            console.error('Error downloading file:', error.response ? error.response.data : error.message);
            toast.error('Error downloading file. Please try again.');
        }
    };
    const handlePasscodeChange = (id, value) => {
        setPasscodes({ ...passcodes, [id]: value });
    };

    const handleViewFile = (file) => {
        if (file.isEncrypted) {
           router.push("/components/Passcode");
        }
        router.push(`/components/Material/${file._id}`);
        toast.success('Access granted! Opening file...');
    };

    const handleShare = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found, user might not be logged in.');
            return;
        }
        try {
            const response = await axios.get(`http://localhost:4000/api/v1/file/shareFile/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const link = response.data.link; // Assuming the backend returns the link in response.data.link
            setShareLinks((prevLinks) => ({ ...prevLinks, [id]: link })); // Update state with the link
        } catch (error) {
            console.error('Error sharing file:', error.response ? error.response.data : error.message);
            toast.error('Error sharing file. Please try again.');
        }
    };
    const handleFileDeleted = (fileId) => {
        console.log('Previous files:', files); // Log current state
        const updatedFiles = files.filter((file) => file._id !== fileId);
        console.log('Updated files:', updatedFiles); // Log updated state
        setFiles(updatedFiles);
    };
    
    return (
        <>
        <Navbar/>
    
        <div className="p-10  min-h-screen">
            <ToastContainer />
            <h1 className="text-center text-4xl font-light mb-8 text-gray-800">{files.length === 0 ? " " : "Files"} </h1>
            {files.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 rounded-lg space-y-6">
                <FaFileUpload className="text-gray-500 text-6xl" />
                <p className="text-lg text-gray-600 mb-4">No files uploaded yet.</p>
                <Link href="/components/Postdata">
                    <button className="flex items-center space-x-2 px-6 py-3 bg-indigo-700 text-white rounded-full hover:bg-indigo-600 transition">
                        <FaFileUpload className="text-white text-xl" />
                        <span>Upload File</span>
                    </button>
                </Link>
            </div>
            ) : (
                <div className="flex flex-wrap justify-center gap-10">
                    {files.map((file) => (
                        <Card
                            key={file._id}
                            file={file}
                            onDownload={() => handleDownload(file._id, file.filename)}  // Pass both file ID and filename
                            onViewFile={handleViewFile}
                            shareLink={shareLinks[file._id]} // Pass the link to the Card component
                            onFileDeleted={handleFileDeleted} // Pass the prop
                            onShare={() => handleShare(file._id)}
                            onPasscodeChange={handlePasscodeChange}
                            passcode={passcodes[file._id] || ''}
                        />
                    ))}

                </div>
            )}
        </div>
        </>
    );
};

export default Page;
