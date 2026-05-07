'use client'

import Cookies from 'js-cookie';

export default function Navbar({ activePage }: { activePage: String}) {

    const userName = Cookies.get('userName');

    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('userName');
        window.location.href = '/login';
    }

    return (
        <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Finance Tracker</h1>
            <div className="flex items-center gap-4">
                <a href="/dashboard" className="text-sm text-gray-600 hover:text-blue-600">Dashboard</a>
                <a href="/categories" className="text-sm text-gray-600 hover:text-blue-600">Categories</a>
                <a href="/transactions" className="text-sm text-gray-600 hover:text-blue-600">Transactions</a>
                <span className="text-sm text-gray-600">Hello, {userName}</span>
                <button
                    onClick={handleLogout}
                    className="text-sm text-red-600 hover:underline"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}