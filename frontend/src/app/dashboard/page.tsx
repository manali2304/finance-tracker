'use client';

import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import api from '@/services/api';
import { BarChart, Bar, PieChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Pie, Cell, Legend } from 'recharts';
import { DashboardData } from '@/types';
import axios from 'axios';
import Navbar  from '@/components/Navbar';

export default function DashboardPage() {

    const [ dashboard, setDashboard] = useState<DashboardData | null>(null);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState('');
    const userName = Cookies.get('userName');

    useEffect(() => {
        fetchDashboard()
    }, []);

    const fetchDashboard = async () => {
        try {
            console.log('Token:', Cookies.get('token')); 
            const response = await api.get('/dashboard');
            setDashboard(response.data);
        } catch (err) {
            console.log('Error:', err);
            setError('Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('userName');
        window.location.href = '/login';
    };

    const barData = dashboard ? [
        { name: 'Income', amount: Number(dashboard.totalIncome) },
        { name: 'Expense', amount: Number(dashboard.totalExpense) },
        { name: 'Balance', amount: Number(dashboard.balance) },
    ] : [];

    const pieData = dashboard ? [
        { name: 'Income', amount: Number(dashboard.totalIncome) },
        { name: 'Expense', amount: Number(dashboard.totalExpense) }
    ] : [];

    const COLORS = ['#22c55e', '#ef4444'];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">Loading...</p>
            </div>
        )
    };
    
    return (
        <div className="min-h-screen bg-gray-50">
        <Navbar activePage="dashboard" />

        <main className="max-w-6xl mx-auto px-6 py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
                        {error}
                    </div>
                )}

                {dashboard && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Total Income</p>
                                <p className="text-2xl font-bold text-green-600">
                                    ₹{Number(dashboard.totalIncome).toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Total Expense</p>
                                <p className="text-2xl font-bold text-red-600">
                                    ₹{Number(dashboard.totalExpense).toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Balance</p>
                                <p className={`text-2xl font-bold ${Number(dashboard.balance) >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                    ₹{Number(dashboard.balance).toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Transactions</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {dashboard.transactionCount}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">Overview</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={barData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">Income vs Expense</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            dataKey="amount"
                                            label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={index} fill={COLORS[index]} />
                                            ))}
                                        </Pie>
                                        <Legend />
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
        
    );
}