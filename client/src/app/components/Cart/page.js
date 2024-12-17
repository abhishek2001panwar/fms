/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoCart,  } from 'react-icons/io5';
import { BsArrowRightCircleFill, BsThreeDots } from 'react-icons/bs';
import { MdLock } from 'react-icons/md';
import { GoCheckCircleFill } from 'react-icons/go';
import { AiFillCloseCircle, AiFillDelete } from 'react-icons/ai';
import { HiLockOpen } from 'react-icons/hi';
import Link from 'next/link';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [val, setVal] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [passcode, setPasscode] = useState('');
    const [shareLink, setShareLink] = useState('');

    useEffect(() => {
        // Fetch the cart data when the component mounts
        const fetchCartItems = async () => {
            const token = localStorage.getItem('token');

            try {
                const response = await axios.post(
                    'http://localhost:4000/api/v1/cart/get',
                    {},
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (response.data.cart && response.data.cart.files) {
                    setCart(response.data.cart.files);
                } else {
                    setMessage('No items in cart.');
                }
            } catch (error) {
                console.error('Error fetching cart items:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, []);

    const handleDownload = (id, filename) => {
        console.log(`Downloading file: ${filename}`);
    };

    const handleShare = (file) => {
        console.log('Sharing file:', file);
    };

    const handlePasscodeChange = (fileId, passcode) => {
        console.log(`Passcode for file ${fileId}:`, passcode);
    };

    const toggleOptions = () => setIsOpen(!isOpen);
    const toggleVal = () => setVal(!val);

    if (loading) {
        return <div>Loading cart...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
                <IoCart className="text-3xl text-blue-600" />
                File Bin
            </h2>

            {cart.length === 0 ? (
                <div className="text-center text-lg text-gray-500">Your Bin is empty.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cart.map((file) => (
                        <div key={file._id} className="bg-white shadow-md rounded-3xl p-4 sm:p-6 md:p-8 lg:p-3 max-h-[300px] w-[90%] sm:w-[500px] max-w-[500px] relative border border-gray-300">
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="text-green-500 gap-3 flex items-center">
                                        {file.isEncrypted ? (
                                            <MdLock className="w-8 h-8 sm:w-8 sm:h-8 text-red-500" />
                                        ) : (
                                            <GoCheckCircleFill className="w-8 h-8 sm:w-8 sm:h-8 text-green-500" />
                                        )}
                                        <span className="ml-1 capitalize text-sm sm:text-base md:text-xl font-semibold text-black tracking-tight">{file.title}</span>
                                    </div>
                                    <button className="rounded-md mt-3 border-2 bg-zinc-200 text-black font-semibold px-3 sm:px-4 py-1 text-sm sm:text-base">
                                        {new Date(file.uploadDate).toLocaleDateString()}
                                    </button>
                                </div>
                                <div className="flex items-center mt-6 sm:mt-10 space-x-3">
                                    <AiFillDelete className="text-lg sm:text-xl" />
                                </div>
                                <div className="absolute top-3 right-4">
                                    <BsThreeDots
                                        className="text-2xl cursor-pointer"
                                        onClick={toggleOptions}
                                        aria-expanded={isOpen ? 'true' : 'false'}
                                        aria-label="More options"
                                    />
                                    {isOpen && (
                                        <div className="absolute right-0 mt-2 bg-white shadow-xl rounded-xl w-32">
                                            <ul className="text-sm">
                                                <li className="p-2 hover:bg-gray-100" onClick={() => handleDownload(file._id, file.filename)}>Download</li>
                                                <li className="p-2 hover:bg-gray-100" onClick={() => handleShare(file)}>Share File</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {file.isShareable ? (
                                <div className="mt-4">
                                    <div className="mt-4 flex items-center text-green-500">
                                        <AiFillCloseCircle className="mr-2 text-xl" />
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
                                <div className="mt-4 flex items-center text-red-500">
                                    <AiFillCloseCircle className="mr-2 text-xl" />
                                    <span>Not Sharable</span>
                                </div>
                            )}

                            <div className="mt-10 bg-blue-100 w-full border-t-2 p-3 sm:p-4 rounded-b-2xl">
                                <div className="flex items-center gap-2">
                                    {file.isEncrypted ? (
                                        <HiLockOpen className="text-black text-2xl" onClick={toggleVal} />
                                    ) : (
                                        <>
                                            <BsArrowRightCircleFill className="text-2xl" />
                                            <Link href={`/components/Material/${file._id}`} className="text-black">
                                                View
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                            {val && file.isEncrypted && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-52 bg-zinc-50 border-2 border-gray-300 rounded-xl shadow-xl">
                                    <div className="mt-4 p-10 text-black">
                                        <label className="block mb-2">Enter Passcode: To Open file</label>
                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            handleCheck();
                                        }}>
                                            <input
                                                type="password"
                                                placeholder="Passcode"
                                                className="border border-gray-300 p-2 rounded-md w-full mb-5 focus:outline-none focus:border-indigo-600"
                                                value={passcode}
                                                onChange={(e) => handlePasscodeChange(file._id, e.target.value)}
                                            />
                                            <button type="submit" className="py-2 px-5 bg-black text-white font-semibold rounded-md">
                                                Enter
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Cart;
