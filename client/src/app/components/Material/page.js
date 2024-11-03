'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import Card from '../../components/Card/page';

const Page = () => {
    const [files, setFiles] = useState([]);
    const [passcodes, setPasscodes] = useState({});
    const router = useRouter();

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
                toast.error('Failed to fetch files. Please try again later.');
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
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
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
        const enteredPasscode = passcodes[file._id];

        if (file.isEncrypted && (!enteredPasscode || enteredPasscode.trim() === '')) {
            toast.warn('Access denied! Please enter the passcode to view this file.');
            return;
        }

        toast.success('Access granted! Opening file...');
        router.push(`/components/Material/${file._id}`);
    };

    return (
        <div className="p-10 bg-gray-100 min-h-screen">
            <ToastContainer />
            <h1 className="text-center text-4xl font-light mb-8 text-gray-800">Files</h1>
            {files.length === 0 ? (
                <div className="text-center">
                    <p className="text-lg text-gray-600 mb-4">No files uploaded yet.</p>
                    <Link href="/components/Postdata">
                        <button className="px-4 py-2 bg-indigo-700 text-white rounded-full hover:bg-indigo-600 transition">
                            Upload File
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="flex flex-wrap justify-center gap-10">
                    {files.map((file) => (
                        <Card
                            key={file._id}
                            file={file}
                            onDownload={handleDownload}
                            onViewFile={handleViewFile}
                            onPasscodeChange={handlePasscodeChange}
                            passcode={passcodes[file._id] || ''}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Page;
