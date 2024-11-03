// components/Navbar.js
'use client';
import { AuthContext } from '@/Context/AuthProvider';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { AiFillLock, AiFillCloud, AiOutlineShareAlt, AiOutlineHistory } from 'react-icons/ai';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isLoggedIn , logout } = useContext(AuthContext);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <>
            <nav className="p-7 m-3 flex justify-between items-center relative">
                <div className="text-xl font-bold">File Manager</div>
                <div className="hidden md:flex space-x-4">
                    {isLoggedIn ? (
                        <>
                            <Link href="/dashboard">
                                <span className="bg-white text-black px-3 py-3 rounded-full">Dashboard</span>
                            </Link>
                            <button onClick={logout} className="bg-black text-white px-7 py-3 rounded-full">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link href="/components/Login">
                                <span className="bg-white text-black px-3 py-3 rounded-full">Login</span>
                            </Link>
                            <Link href="/components/Signup">
                                <span className="bg-black text-white px-7 py-3 rounded-full">Signup</span>
                            </Link>
                        </>
                    )}
                    <button className="" onClick={toggleMenu} aria-label="Toggle Menu">
                        <svg
                            className="w-6 h-6 text-2xl text-black"
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
                <button className="md:hidden" onClick={toggleMenu} aria-label="Toggle Menu">
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

                {/* Dropdown Menu */}
                {menuOpen && (
                    <div className="absolute right-3 mt-44 w-48 bg-white rounded-md shadow-xs border-2 z-20">
                        <Link href="/contact">
                            <span className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Contact</span>
                        </Link>
                        <Link href="/about">
                            <span className="block px-4 py-2 text-gray-800 hover:bg-gray-200">About</span>
                        </Link>
                        {isLoggedIn && (
                            <div>
                                <button onClick={logout} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Logout</button>
                            </div>
                        )}
                    </div>
                )}
            </nav>
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-5xl font-light text-center mb-8">Effortlessly Manage Your Files and Documents</h2>
                    <p className="text-lg text-center text-gray-700 mb-12">Securely store, share, and collaborate on your files.</p>
                    <div className="flex flex-col md:flex-row justify-center items-center">
                        <input type="email" placeholder="Your Email" className="w-full md:w-1/3 px-4 py-3 border border-gray-300 rounded-full mb-4 md:mb-0 md:mr-4" />
                        <button className="bg-black text-white font-bold py-3 px-6 rounded-full">Get Started</button>
                    </div>

                    <h3 className="text-2xl font-bold text-center mt-16 mb-8">Popular Features</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="shadow-xs rounded-xl border-2 p-8">
                            <h4 className="text-xl font-bold mb-4">
                                <AiFillLock className="inline-block mr-2 text-xl" />
                                File Encryption
                            </h4>
                            <p>Secure your files with advanced encryption techniques.</p>
                            <button className="bg-black text-white font-bold py-2 px-4 rounded-md mt-4">→</button>
                        </div>
                        <div className="bg-white shadow-xs border-2 rounded-xl p-8">
                            <h4 className="text-xl font-bold mb-4">
                                <AiFillCloud className="inline-block mr-2 text-xl" />
                                Cloud Backup
                            </h4>
                            <p>Automatically back up your files to the cloud for peace of mind.</p>
                            <button className="bg-black text-white font-bold py-2 px-4 rounded-xl mt-4">→</button>
                        </div>
                        <div className="shadow-xs bg-purple-300 rounded-xl border-2 p-8">
                            <h4 className="text-xl font-bold mb-4">
                                <AiOutlineShareAlt className="inline-block mr-2 text-xl" />
                                File Sharing
                            </h4>
                            <p>Share files securely with your team and clients.</p>
                            <button className="bg-black text-white font-bold py-2 px-4 rounded-md mt-4">→</button>
                        </div>
                        <div className="shadow-xs rounded-xl border-2 p-8">
                            <h4 className="text-xl font-bold mb-4">
                                <AiOutlineHistory className="inline-block mr-2 text-xl" />
                                Document Versioning
                            </h4>
                            <p>Keep track of all changes with our version control feature.</p>
                            <button className="bg-black text-white font-bold py-2 px-4 rounded-md mt-4">→</button>
                        </div>
                    </div>

                    <div className="text-center mt-16">
                        <a href="#" className="text-blue-500 hover:underline">Explore All Features</a>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Navbar;
