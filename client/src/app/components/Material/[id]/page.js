'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaLock, FaUnlock } from 'react-icons/fa';

const FileDetail = ({ params }) => {
    const [file, setFile] = useState(null);
    const { id } = React.use(params)

    useEffect(() => {
        const fetchFile = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/v1/file/getOneFile/${id}`);
                const data = await response.json();
                console.log('File data:', data);
                setFile(data.file);
            } catch (error) {
                console.error('Error fetching file:', error);
            }
        };

        fetchFile();
    }, [id]);

    if (!file) {
        return <p>Loading...</p>;
    }

    return (
        <div className="bg-gray-100 min-h-screen flex justify-center items-center p-8">
            <div className="bg-white p-8 flex flex-col md:flex-row rounded-lg shadow-md max-w-5xl">
                {/* Left side: File preview and details */}
                <div className="md:w-1/2 flex flex-col items-center">
                    <Image src={'https://via.placeholder.com/100x100'} alt="File Preview" width={400} height={400} className="rounded-md mb-4" />
                    <button className="text-gray-500 mt-4 font-semibold">Rotate {file.title}</button>
                    <div className="flex space-x-2 mt-4">
                        <Image src="https://via.placeholder.com/100x100" alt="Preview Thumbnail 1" width={100} height={100} className="rounded-lg" />
                        <Image src="https://via.placeholder.com/100x100" alt="Preview Thumbnail 2" width={100} height={100} className="rounded-lg" />
                        <Image src="https://via.placeholder.com/100x100" alt="Preview Thumbnail 3" width={100} height={100} className="rounded-lg" />
                    </div>
                </div>

                {/* Right side: File details and actions */}
                <div className="md:w-1/2 md:ml-8">
                    <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">File Details</p>
                    <h2 className="text-3xl font-bold mb-4">{file.title}</h2>
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
                        File Type: {file.type} <br />
                        File Size: {file.size} <br />
                        Uploaded on: {new Date(file.uploadDate).toLocaleDateString()} <br />
                        {file.permissions ? (
                            <>
                                {file.permissions == "read" ? (
                                    <span className="text-green-500">Read</span>
                                ) : (
                                    <span className="text-red-500">No Read</span>
                                )}
                                {file.permissions == "write" ? (
                                    <span className="text-blue-500">, Write</span>
                                ) : null}
                                {file.permissions == "delete" ? (
                                    <span className="text-orange-500">, Delete</span>
                                ) : null}
                            </>
                        ) : (
                            <span className="text-red-500">No permissions available</span>
                        )}
                        <br />

                    </p>
                    <div className="text-4xl font-bold text-gray-800 mb-6">Actions</div>
                    <div className="flex space-x-4">
                        <button className="bg-black text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800">Download</button>
                        {file.isShareable && (
                            <button className="bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-lg hover:bg-gray-300">Share</button>
                        )}
                        <button className="bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-lg hover:bg-gray-300">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileDetail;
