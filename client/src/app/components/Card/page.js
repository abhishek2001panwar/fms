'use client';
import React, { useState } from 'react';
import { FaShareAlt } from "react-icons/fa";
import { RiChatDownloadFill } from "react-icons/ri";
import { IoBookmarksOutline } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { MdLock } from "react-icons/md"; // Import lock icon
import { GoCheckCircleFill } from "react-icons/go";
import Link from 'next/link';

const Card = ({ file, onDownload, onViewFile, onPasscodeChange, passcode }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOptions = () => {
        setIsOpen(!isOpen);
    };

    if (!file || !file.title) {
        return null;
    }

    return (
        <div className="bg-white shadow-md rounded-3xl p-4 sm:p-6 md:p-8 lg:p-3 h-auto w-[90%] sm:w-[500px] max-w-[500px] relative border border-gray-300">
            <div className="flex justify-between items-center">
                <div>
                    <div className="text-green-500 gap-3 flex items-center">
                        {/* Conditional rendering of icons based on encryption status */}
                        {file.isEncrypted ? (
                            <MdLock className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" /> // Lock icon for encrypted files
                        ) : (
                            <GoCheckCircleFill className="w-8 h-8 sm:w-8 sm:h-8 text-green-500" /> // Green tick icon for non-encrypted files
                            // <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 sm:w-10 sm:h-10">
                            //     <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                            // </svg> // Green tick icon for non-encrypted files
                        )}
                        <span className="ml-1 capitalize text-sm sm:text-base md:text-xl font-semibold text-black tracking-tight">{file.title}</span>
                    </div>
                    <button className="rounded-md mt-3 border-2 bg-zinc-200 text-black font-semibold px-3 sm:px-4 py-1 text-sm sm:text-base">
                        {new Date(file.uploadDate).toLocaleDateString()}
                    </button>
                </div>
                <div className="flex items-center mt-6 sm:mt-10 space-x-3">
                    <IoBookmarksOutline className="text-lg sm:text-xl" />
                    <RiChatDownloadFill className="text-lg sm:text-xl" />
                    <FaShareAlt className="text-lg sm:text-xl" />
                </div>
                <div className="absolute top-3 right-4">
                    <BsThreeDots className="text-2xl cursor-pointer" onClick={toggleOptions} />
                    {isOpen && (
                        <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md p-2 w-32">
                            <ul className="text-sm">
                                <li className="p-2 hover:bg-gray-100" onClick={() => onDownload(file.filename)}>Download</li>
                                <li className="p-2 hover:bg-gray-100" onClick={() => onViewFile(file)}>View File</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            {file.isEncrypted && (
                <div className="mt-4">
                    <label className="block text-gray-600 mb-2">Enter Passcode:</label>
                    <input
                        type="password"
                        placeholder="Passcode"
                        className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:border-indigo-600"
                        value={passcode}
                        onChange={(e) => onPasscodeChange(file._id, e.target.value)}
                    />
                </div>
            )}
            {/* <div className="mt-10 bg-blue-100 w-full border-t-2 p-3 sm:p-4 rounded-b-2xl">
                <div className="flex items-center gap-2">
                    <FaArrowRightToBracket className="text-gray-500" /><Link href={`/components/Material/${file._id}`} className="text-gray-500">View</Link>
                </div>
            </div> */}
             <div className="mt-10 bg-blue-100 w-full border-t-2 p-3 sm:p-4 rounded-b-2xl">
                <div className="flex items-center gap-2">
                    <FaArrowRightToBracket className="text-gray-500" />
                    <Link href={`/components/Material/${file._id}`} className="text-gray-500">
                        View
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Card;
