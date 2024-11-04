// components/Navbar.js
'use client';
import { AiFillLock, AiFillCloud, AiOutlineShareAlt, AiOutlineHistory } from 'react-icons/ai';
import Navbar from '../Navbar/page'
import Link from 'next/link';
import { AuthContext } from '@/Context/AuthProvider';
import { useContext, useState } from 'react';
const Hero = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        if (value) {
            fetchSearchResults(value);
        } else {
            setSearchResults([]); // Clear results if input is empty
        }
    };

    const fetchSearchResults = async (searchTerm) => {
        try {
            const response = await fetch(`http://localhost:4000/api/v1/file/search/${encodeURIComponent(searchTerm)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setSearchResults(data); // Assuming data is an array of files
        } catch (error) {
            console.error('Error fetching search results:', error);
            // Handle error state appropriately
        }
    };
    

    const handleFocus = () => {
        if (searchTerm) {
            setDropdownVisible(true); // Show dropdown if there's a search term
        }
    };

    const handleBlur = () => {
        setDropdownVisible(false); // Hide dropdown when input loses focus
    };

    return (
        <>
           
            <Navbar/>
          
            <section className="py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-5xl font-regular text-center mb-8">Effortlessly Manage Your Files and Documents</h2>
                <p className="text-lg text-center text-gray-700 mb-12">Securely store, share, and collaborate on your files.</p>
                <div className="flex flex-col md:flex-row justify-center items-center">
                    <input
                        type="text"
                        placeholder="Search files..."
                        value={searchTerm}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        className="w-full md:w-1/3 px-4 py-3 border border-gray-300 rounded-full mb-4 md:mb-0 md:mr-4"
                    />
                    <button className="bg-black text-white font-bold py-3 px-6 rounded-full">Get Started</button>
                </div>

                {isDropdownVisible && searchResults.length > 0 && (
                    <div className="absolute bg-w border border-gray-500 flex flex-col  shadow-lg rounded-md mt-2 w-1/3  z-99">
                        {searchResults.map((result, index) => (
                            <Link href={`/components/Material/${result._id}`} key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                {result.title} {/* Adjust according to your result structure */}
                            </Link>
                        ))}
                    </div>
                )}

                <h3 className="text-2xl font-bold text-center mt-20 mb-8">Features</h3>

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
                    <div className="shadow-xs bg-blue-200 rounded-xl border-2 p-8">
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
                    {isLoggedIn ? (
                        <Link href="/components/Material" className="text-blue-500 hover:underline">Explore All Features</Link>
                    ) : (
                        <Link href="/components/Login" className="text-blue-500 hover:underline">Explore All Features</Link>
                    )}
                </div>
            </div>
        </section>
        </>
    );
};

export default Hero;
