'use client'
import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/Context/AuthProvider';

const Page = () => {
    const { register } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Call register function from AuthContext
            await register(formData.name, formData.email, formData.password);
            // Redirect to login page after successful registration
            router.push('/components/Login');
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred while registering. Please try again.');
        }
    };

    return (
        <div>
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xs border border-gray-200">
                    <h2 className="text-3xl font-bold text-center text-gray-800">
                        Create Your Account
                    </h2>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                            />
                        </div>
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                            />
                        </div>
                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                            />
                        </div>
                        {/* Signup Button */}
                        <div>
                            <button
                                type="submit"
                                className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>
                    {/* OR Divider */}
                    <div className="relative text-center my-4">
                        <span className="text-gray-500 bg-white px-4">OR</span>
                        <div className="absolute inset-0 border-t border-gray-300" />
                    </div>
                    {/* Login Link */}
                    <p className="text-center text-sm text-gray-600 mt-4">
                        Already have an account?{' '}
                        <Link href="/components/Login">
                            <span className="text-black font-semibold hover:underline cursor-pointer">
                                Log In
                            </span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Page;
