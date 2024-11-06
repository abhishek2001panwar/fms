'use client';
import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { AuthContext } from '@/Context/AuthProvider';
import { MdAttachFile } from "react-icons/md";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isLoggedIn, logout } = useContext(AuthContext);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    return (
        <div>
            <nav className="p-5 m-3 flex justify-between items-center">
                {/* Logo */}
                <div className="flex gap-3 items-center">
                    <MdAttachFile className="w-8 h-8" />
                    <Link href="/" className="text-xl font-bold">
                        File Manager
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex md:items-center space-x-4">
                    {isLoggedIn ? (
                        <>
                            <Link href="/components/Material" className="bg-white border-2 text-black px-3 py-3 rounded-full">
                                Files
                            </Link>
                            <Link href="/components/Postdata" className="bg-black text-white px-7 py-3 rounded-full">
                                Upload
                            </Link>
                            <button onClick={logout} className="bg-black text-white px-3 py-3 rounded-full">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/components/Login" className="border-2 border-gray-200 text-black px-3 py-3 rounded-full">
                                Login
                            </Link>
                            <Link href="/components/Signup" className="bg-black text-white px-7 py-3 rounded-full">
                                Signup
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Icon */}
                <div className="md:hidden">
                    <button onClick={toggleMenu} aria-label="Toggle Menu">
                        <svg
                            className="w-6 h-6 text-black"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    </button>
                </div>

                {/* Mobile Dropdown Menu */}
                {menuOpen && (
                    <div className="absolute top-16 right-5 bg-white rounded-md shadow-lg border-2 p-4 z-20 w-48 md:hidden">
                        <Link href="/contact" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                            Contact
                        </Link>
                        <Link href="/about" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                            About
                        </Link>
                        {isLoggedIn ? (
                            <>
                                <Link href="/components/Material" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                                    Files
                                </Link>
                                <Link href="/components/Postdata" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                                    Upload
                                </Link>
                                <button onClick={logout} className="block px-4 py-2 text-red-700 hover:bg-gray-200">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/components/Login" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                                    Login
                                </Link>
                                <Link href="/components/Signup" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                                    Signup
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </nav>
        </div>
    );
};

export default Navbar;
