'use client';
import React, { useState } from 'react';
import { IoSettings } from "react-icons/io5";
import { IoBookmarksOutline } from "react-icons/io5";
import { BsArrowRightCircleFill, BsThreeDots } from "react-icons/bs";
import { MdLock } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import { HiLockOpen } from "react-icons/hi";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai"; // Importing the icon for "Not Sharable"
import Link from 'next/link';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import bcrypt from 'bcryptjs';



const Card = ({ file, onDownload, onShare, shareLink, onPasscodeChange, passcode } ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [val, setVal] = useState(false);
    const router = useRouter();

    const toggleOptions = () => {
        setIsOpen(!isOpen);
    };

    const toggleVal = () => {
        setVal(!val);
    };
    const handleCart = async (id) => {
        try {

            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:4000/api/v1/cart/add',
                { fileId: id }, // Use the correct property name

                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            toast.success('File added to cart successfully', response.data.message);
        } catch (error) {
            console.log(error);
            toast.error('Error adding file to cart');
        }
    };

    // const handleCheck = async () => {
    //     try {
    //         const response = await axios.post('http://localhost:4000/api/v1/file/verify-passcode', {
    //             fileId: file._id,
    //             passcode: passcode, // Pass the user-entered passcode
    //         });

    //         // If successful, redirect to the file page
    //         if (response.status === 200) {
    //             router.push(`/components/Material/${file._id}`);
    //         }
    //     } catch (error) {
    //         console.error('Error verifying passcode:', error);
    //         toast.error(error.response?.data?.message || 'Passcode incorrect');
    //     }
    // };

    const handleCheck = async () => {
        try {
            if (file.isEncrypted) {
                const isPasscodeValid = await bcrypt.compare(passcode, file.passcode);
                if (isPasscodeValid) {
                    router.push(`/components/Material/${file._id}`);
                } else {
                    toast.error('Incorrect passcode');
                }
            } else {
                console.log('Redirecting to file page without passcode check');
                router.push(`/components/Material/${file._id}`);
            }
        } catch (error) {
            console.error('Error during passcode validation:', error);
            toast.error('An error occurred');
        }
    };

    const handleRemove = async () => {
        try {
            console.log('Deleting file:', file._id);
            const token = localStorage.getItem('token');
    
            const response = await fetch(`http://localhost:4000/api/v1/file/deleteFile/${file._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
    
            const result = await response.json();
            if (response.ok && result.success) {
                console.log('File deleted successfully:', file._id);
                if (onFileDeleted) {
                    onFileDeleted(file._id); // Call the parent callback
                }
            } else {
                console.error('Error deleting file:', result.message);
            }
        } catch (error) {
            console.error('Error during deletion:', error);
        }
    };
    
    
    

    if (!file || !file.title) {
        return null;
    }

    return (
        <>
            <div className="bg-white shadow-md rounded-3xl p-4 sm:p-6 md:p-8 lg:p-3 max-h-[300px] w-[90%] sm:w-[500px] max-w-[500px] relative border border-gray-300">
                <div className="flex justify-between items-center">
                    <div>
                        <div className="text-green-500 gap-3 flex items-center">
                            {/* Conditional rendering of icons based on encryption status */}
                            {file.isEncrypted ? (
                                <MdLock className="w-8 h-8 sm:w-8 sm:h-8 text-red-500" /> // Lock icon for encrypted files
                            ) : (
                                <GoCheckCircleFill className="w-8 h-8 sm:w-8 sm:h-8 text-green-500" /> // Green tick icon for non-encrypted files
                            )}
                            <span className="ml-1 capitalize text-sm sm:text-base md:text-xl font-semibold text-black tracking-tight">{file.title}</span>
                        </div>
                        <button className="rounded-md mt-3 border-2 bg-zinc-200 text-black font-semibold px-3 sm:px-4 py-1 text-sm sm:text-base">
                            {new Date(file.uploadDate).toLocaleDateString()}
                        </button>
                    </div>
                    <div className="flex items-center mt-6 sm:mt-10 space-x-3">
                        <button onClick={() => handleCart(file._id)}><IoBookmarksOutline className="text-lg sm:text-xl" /></button>
                        <IoSettings className="text-lg sm:text-xl" />
                        <button onClick={()=> handleRemove(file._id)} >
                        <AiFillDelete  className="text-lg sm:text-xl" />
                            </button>
                        {/* {
                            file.isEncrypted ? (
                                <HiLockOpen className="text-lg sm:text-xl" onClick={toggleVal} />
                            ) : (
                                null
                            )
                        } */}


                    </div>
                    <div className="absolute top-3 right-4">
                        <BsThreeDots
                            className="text-2xl cursor-pointer"
                            onClick={toggleOptions}
                            aria-expanded={isOpen ? "true" : "false"}
                            aria-label="More options"
                        />
                        {isOpen && (
                            <div className="absolute right-0 mt-2 bg-white shadow-xl  rounded-xl w-32">
                                <ul className="text-sm">
                                    <li className="p-2 hover:bg-gray-100" onClick={() => onDownload(file._id, file.filename)}>Download</li>
                                    <li className="p-2 hover:bg-gray-100" onClick={() => onShare(file)}>Share File</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {file.isShareable ? (
                    <div className="mt-4">
                        <div className="mt-4 flex items-center text-green-500">
                            <AiFillCloseCircle className="mr-2 text-xl" /> {/* Red X icon */}
                            <span> Sharable</span>
                        </div>
                        <a
                            href={shareLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline break-all"
                        >
                            {shareLink}
                        </a>
                    </div>
                ) : (
                    <>
                        <div className="mt-4 flex items-center text-red-500">
                            <AiFillCloseCircle className="mr-2 text-xl" /> {/* Red X icon */}
                            <span>Not Sharable</span>
                        </div>

                    </>
                )}
              <div className="mt-10 bg-blue-100 w-full border-t-2 p-3 sm:p-4 rounded-b-2xl">
        <div className="flex items-center gap-2">
            {file.isEncrypted ? (
                <HiLockOpen className="text-black text-2xl" onClick={toggleVal} />
            ) : (
                <>
                    <BsArrowRightCircleFill className='text-2xl' />
                    <Link href={`/components/Material/${file._id}`} className="text-black">
                        View
                    </Link>
                </>
            )}
        </div>
    </div>
            </div>
            <div className={` ${val ? 'block' : 'hidden'}   absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-52 bg-zinc-50 border-2 border-gray-300 rounded-xl shadow-xl`}>

                {file.isEncrypted && (
                    <div className="mt-4 p-10 text-black">
                        <label className="block  mb-2">Enter Passcode: To Open file</label>
                        <form onSubmit={(e) => {
                            e.preventDefault(); // Prevent page reload
                            handleCheck();
                        }}>
                            <input
                                type="password"
                                placeholder="Passcode"
                                className="border border-gray-300 p-2 rounded-md w-full mb-5 focus:outline-none focus:border-indigo-600"
                                value={passcode}
                                onChange={(e) => onPasscodeChange(file._id, e.target.value)}
                            />
                            <button type="submit" className=" py-2 px-5 bg-black text-white font-semibold rounded-md">
                                Enter
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
};

export default Card;