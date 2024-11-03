'use client';
import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/Context/AuthProvider';

const LoginPage = () => {
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData); // Pass the whole formData object
            router.push('/components/Material'); // Redirect after login
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xs border border-gray-200">
                <h2 className="text-3xl font-bold text-center text-gray-800">
                    Login to Your Account
                </h2>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
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
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
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
                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition"
                        >
                            Log In
                        </button>
                    </div>
                </form>
                {/* Register Link */}
                <p className="text-center text-sm text-gray-600">
                    Don’t have an account?{" "}
                    <Link href="/components/Signup">
                        <span className="text-black font-semibold hover:underline cursor-pointer">
                            Register here
                        </span>
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
