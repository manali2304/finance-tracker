'use client'

import { useState } from "react"
import Cookies from "js-cookie"
import axios from "axios"
import Link from "next/link"

export default function RegisterPage() {
    // state variables, each hold a value and a function to update it
    const [name, setName] = useState(''); 
    const [email, setEmail] = useState(''); // stores the email input value, starts with empty
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // tracks if requests is loading, starts with false

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault(); // stopes browser from refreshing after form submit 
        setError(''); // clear all old errors
        setLoading(true); // loading over the submit button

        try {
            const response = await axios.post('http://localhost:8080/api/auth/register', {
                name,
                email, 
                password
            });
            Cookies.set('token', response.data.token, { expires: 1 }); // set JWT token, expires in 1 day
            Cookies.set('userName', response.data.name, { expires: 1 });
            window.location.href = '/dashboard';
        }
        catch (err: any) {
            setError(err.response?.data?.error || 'Registration  failed. Please try again.');
        }
        finally {
            setLoading(false); // always stop loading whether success of failure
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center"> 
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"> 
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center"> 
                    Finance Tracker
                </h1>
                <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center"> 
                    Create Account
                </h2>

                {error && (  // display the error message if present
                    <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm"> 
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister}>
                <div className="mb-4"> 
                            <label className="block text-sm font-medium text-gray-700 mb-1"> 
                                Name
                            </label>
                            <input 
                                type = 'text'
                                value = {name}
                                onChange = {(e) => setName(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" // full width, bordered, blue focus ring
                                placeholder="John Doe" 
                                required
                            />
                    </div>

                    <div className="mb-4"> 
                            <label className="block text-sm font-medium text-gray-700 mb-1"> 
                                Email
                            </label>
                            <input 
                                type = 'email'
                                value = {email}
                                onChange = {(e) => setEmail(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" // full width, bordered, blue focus ring
                                placeholder="john@gmail.com" 
                                required
                            />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password" // masks the input characters
                            value={password} // controlled input
                            onChange={(e) => setPassword(e.target.value)} // update state on every keystroke
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit" 
                        disabled={loading} 
                        className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50" 
                    >
                        {loading ? 'Creating account...' : 'Create Account'} 
                    </button>
                </form>
                    <p className="text-center text-sm text-gray-600 mt-4"> 
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-600 hover:underline"> 
                        Login
                    </Link>
                </p>
            </div>
        </div>
                
    );
}

