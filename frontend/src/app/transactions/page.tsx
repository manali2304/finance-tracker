'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Transaction, Category } from '@/types';
import Navbar from '@/components/Navbar';

export default function TransactionsPage() {

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // form state
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    // filter state
    const [filterType, setFilterType] = useState('ALL');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [transactionsRes, categoriesRes] = await Promise.all([
                api.get('/transactions'),
                api.get('/categories')
            ]);
            setTransactions(transactionsRes.data);
            setCategories(categoriesRes.data);
        } catch (err: any) {
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        setError('');

        try {
            if (editingId) {
                await api.put(`/transactions/${editingId}`, {
                    categoryId,
                    amount,
                    description,
                    date
                });
            } else {
                await api.post('/transactions', {
                    categoryId,
                    amount,
                    description,
                    date
                });
            }
            resetForm();
            fetchData();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Something went wrong');
        } finally {
            setFormLoading(false);
        }
    };

    const handleEdit = (transaction: Transaction) => {
        setEditingId(transaction.id);
        setAmount(String(transaction.amount));
        setDescription(transaction.description);
        setDate(transaction.date);
        setCategoryId(String(transaction.category.id));
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this transaction?')) return;
        try {
            await api.delete(`/transactions/${id}`);
            fetchData();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to delete');
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setAmount('');
        setDescription('');
        setDate('');
        setCategoryId('');
    };

    // filter transactions based on selected type
    const filteredTransactions = transactions.filter(t => {
        if (filterType === 'ALL') return true;
        return t.category.type === filterType;
    });

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <p className="text-gray-600">Loading...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar activePage="transactions" />

            <main className="max-w-6xl mx-auto px-6 py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Transactions</h2>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Add/Edit Form */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            {editingId ? 'Edit Transaction' : 'Add Transaction'}
                        </h3>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0.00"
                                    min="0.01"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name} ({cat.type})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. Monthly salary"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {formLoading ? 'Saving...' : editingId ? 'Update' : 'Add'}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md text-sm font-medium hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Transactions List */}
                    <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-700">
                                    Transactions ({filteredTransactions.length})
                                </h3>
                                {/* Filter buttons */}
                                <div className="flex gap-2">
                                    {['ALL', 'INCOME', 'EXPENSE'].map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => setFilterType(f)}
                                            className={`text-xs px-3 py-1 rounded-full font-medium ${
                                                filterType === f
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {filteredTransactions.length === 0 ? (
                                <p className="text-gray-500 text-sm">No transactions found.</p>
                            ) : (
                                <div className="space-y-2">
                                    {filteredTransactions.map((transaction) => (
                                        <div
                                            key={transaction.id}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                                    transaction.category.type === 'INCOME'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {transaction.category.type}
                                                </span>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">
                                                        {transaction.description || transaction.category.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {transaction.category.name} • {transaction.date}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-sm font-bold ${
                                                    transaction.category.type === 'INCOME'
                                                        ? 'text-green-600'
                                                        : 'text-red-600'
                                                }`}>
                                                    {transaction.category.type === 'INCOME' ? '+' : '-'}
                                                    ₹{Number(transaction.amount).toLocaleString()}
                                                </span>
                                                <button
                                                    onClick={() => handleEdit(transaction)}
                                                    className="text-xs text-blue-600 hover:underline"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(transaction.id)}
                                                    className="text-xs text-red-600 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}