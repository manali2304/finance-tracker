'use client';

import { useEffect } from 'react';
import Cookies from 'js-cookie';

export default function HomePage() {
    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            window.location.href = '/dashboard';
        } else {
            window.location.href = '/login';
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <p className="text-gray-600">Loading...</p>
        </div>
    );
}