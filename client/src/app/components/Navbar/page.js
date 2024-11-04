// "use client";
// import React, { useContext, useState } from "react";
// import Link from "next/link";
// import { FaSignOutAlt, FaSignInAlt, FaUserPlus, FaBars, FaTimes, FaHome, FaInfoCircle, FaPhone, FaUpload, FaFileAlt } from "react-icons/fa";
// import { AuthContext } from "@/Context/AuthProvider";

// const Navbar = () => {
//     const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
//     const { isLoggedIn, logout } = useContext(AuthContext);

//     const toggleMobileMenu = () => {
//         setMobileMenuOpen(!isMobileMenuOpen);
//     };

//     return (
//         <div className="w-full bg-white fixed top-0 z-10 shadow-md">
//             <nav className="container mx-auto flex items-center justify-between p-6">
//                 <div className="text-xl font-bold text-indigo-600">FMS</div>

//                 {/* Desktop Links */}
//                 <div className="hidden md:flex items-center space-x-8">
//                     <Link href="/">
//                         <button className="flex items-center text-black hover:text-indigo-600 transition duration-200">
//                             <FaHome className="mr-1" /> Home
//                         </button>
//                     </Link>
//                     <Link href="/about">
//                         <button className="flex items-center text-black hover:text-indigo-600 transition duration-200">
//                             <FaInfoCircle className="mr-1" /> About
//                         </button>
//                     </Link>
//                     <Link href="/contact">
//                         <button className="flex items-center text-black hover:text-indigo-600 transition duration-200">
//                             <FaPhone className="mr-1" /> Contact
//                         </button>
//                     </Link>

//                     {/* Conditional rendering for Login/Signup or Logout */}
//                     {isLoggedIn ? (
//                         <>
//                             <Link href="/components/Postdata">
//                                 <button className="flex items-center text-black hover:text-indigo-600 transition duration-200">
//                                     <FaUpload className="mr-1" /> Upload
//                                 </button>
//                             </Link>
//                             <Link href="/components/Material">
//                                 <button className="flex items-center text-black hover:text-indigo-600 transition duration-200">
//                                     <FaFileAlt className="mr-1" /> Files
//                                 </button>
//                             </Link>
//                             <button
//                                 onClick={logout}
//                                 className="flex items-center px-4 py-2 bg-red-400 text-white rounded-full hover:bg-red-500 transition duration-300 ease-in-out shadow-md"
//                             >
//                                 <FaSignOutAlt className="mr-2" /> Logout
//                             </button>
//                         </>
//                     ) : (
//                         <>
//                             <Link href="/components/Login">
//                                 <button className="flex items-center space-x-1 px-3 py-1 text-white bg-indigo-600 rounded-full hover:bg-indigo-800 transition duration-300">
//                                     <FaSignInAlt /> <span>Login</span>
//                                 </button>
//                             </Link>
//                             <Link href="/components/Signup">
//                                 <button className="flex items-center space-x-1 px-3 py-1 text-white bg-indigo-600 rounded-full hover:bg-indigo-800 transition duration-300">
//                                     <FaUserPlus /> <span>Signup</span>
//                                 </button>
//                             </Link>
//                         </>
//                     )}
//                 </div>

//                 {/* Mobile Menu Icon */}
//                 <div className="md:hidden flex items-center">
//                     <button onClick={toggleMobileMenu} className="text-xl text-black">
//                         {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
//                     </button>
//                 </div>

//                 {/* Mobile Menu Links */}
//                 {isMobileMenuOpen && (
//                     <div className="md:hidden absolute items-center top-16 left-0 w-full bg-white shadow-md p-5 flex flex-col space-y-3 z-20">
//                         <Link href="/">
//                             <button onClick={toggleMobileMenu} className="flex items-center text-black hover:text-indigo-600 transition duration-200">
//                                 <FaHome className="mr-1" /> Home
//                             </button>
//                         </Link>
//                         <Link href="/about">
//                             <button onClick={toggleMobileMenu} className="flex items-center text-black hover:text-indigo-600 transition duration-200">
//                                 <FaInfoCircle className="mr-1" /> About
//                             </button>
//                         </Link>
//                         <Link href="/contact">
//                             <button onClick={toggleMobileMenu} className="flex items-center text-black hover:text-indigo-600 transition duration-200">
//                                 <FaPhone className="mr-1" /> Contact
//                             </button>
//                         </Link>
//                         <Link href="/components/Postdata">
//                             <button onClick={toggleMobileMenu} className="flex items-center text-black hover:text-indigo-600 transition duration-200">
//                                 <FaUpload className="mr-1" /> Upload
//                             </button>
//                         </Link>
//                         <Link href="/components/Material">
//                             <button onClick={toggleMobileMenu} className="flex items-center text-black hover:text-indigo-600 transition duration-200">
//                                 <FaFileAlt className="mr-1" /> Files
//                             </button>
//                         </Link>
//                         {isLoggedIn ? (
//                             <button
//                                 onClick={() => {
//                                     logout();
//                                     toggleMobileMenu(); // Close menu on logout
//                                 }}
//                                 className="flex items-center space-x-1 px-3 py-1 text-white bg-red-600 rounded-full hover:bg-red-800 transition duration-300"
//                             >
//                                 <FaSignOutAlt className="mr-1" /> <span>Logout</span>
//                             </button>
//                         ) : (
//                             <>
//                                 <Link href="/components/Login">
//                                     <button onClick={toggleMobileMenu} className="flex items-center space-x-1 px-3 py-1 text-white bg-indigo-600 rounded-full hover:bg-indigo-800 transition duration-300">
//                                         <FaSignInAlt /> <span>Login</span>
//                                     </button>
//                                 </Link>
//                                 <Link href="/components/Signup">
//                                     <button onClick={toggleMobileMenu} className="flex items-center space-x-1 px-3 py-1 text-white bg-indigo-600 rounded-full hover:bg-indigo-800 transition duration-300">
//                                         <FaUserPlus /> <span>Signup</span>
//                                     </button>
//                                 </Link>
//                             </>
//                         )}
//                     </div>
//                 )}
//             </nav>
//             <div className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-200 to-white text-black">
//                 <div className="text-center px-6">
//                     <h1 className="text-5xl md:text-7xl font-bold mb-6">Welcome to FMS</h1>
//                     <p className="text-xl md:text-2xl mb-4">Empowering Your Digital Presence</p>
//                     <p className="text-lg md:text-xl mb-8">
//                         Simplify your document management and enhance collaboration with ease.
//                     </p>
//                     <p className="text-lg md:text-xl mb-10">Join us to revolutionize the way you manage files!</p>
//                     <Link href='/components/Signup'>
//                         <button className="px-8 py-3 bg-white text-black font-light rounded-full shadow-lg transform transition-all hover:scale-105">
//                             Get Started
//                         </button>
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Navbar;

'use client';
import React from 'react';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { AuthContext } from '@/Context/AuthProvider';
const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isLoggedIn, logout } = useContext(AuthContext);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    return (
        <div>
            <nav className="p-5 m-3 flex justify-between items-center">
                <Link href='/' className="text-xl font-bold">File Manager</Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex md:items-center space-x-4">
                    {isLoggedIn ? (
                        <>
                            <Link href="/components/Material">
                                <span className="bg-white border-2 text-black px-3 py-3 rounded-full">Files</span>
                            </Link>
                            <Link href="/components/Postdata">
                                <span className="bg-black text-white px-7 py-3 rounded-full">Upload</span>
                            </Link>
                            <button onClick={logout} className="bg-black text-white px-3 py-3 rounded-full">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link href="/components/Login">
                                <span className=" border-2 border-gray-200  text-black px-3 py-3 rounded-full">Login</span>
                            </Link>
                            <Link href="/components/Signup">
                                <span className="bg-black text-white px-7 py-3 rounded-full">Signup</span>
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
                <div className={`absolute top-16 right-5 bg-white rounded-md shadow-lg border-2 p-4 z-20 w-48 ${menuOpen ? 'block' : 'hidden'} md:hidden`}>
                    <Link href="/contact">
                        <span className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Contact</span>
                    </Link>
                    <Link href="/about">
                        <span className="block px-4 py-2 text-gray-800 hover:bg-gray-200">About</span>
                    </Link>
                    {isLoggedIn ? (
                        <>
                            <Link href="/components/Material">
                                <span className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Files</span>
                            </Link>
                            <Link href="/components/Postdata">
                                <span className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Upload</span>
                            </Link>
                            <button onClick={logout} className="block px-4 py-2 text-red-700 hover:bg-gray-200">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link href="/components/Login">
                                <span className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Login</span>
                            </Link>
                            <Link href="/components/Signup">
                                <span className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Signup</span>
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </div>
    )
}

export default Navbar