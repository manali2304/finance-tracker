'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Category } from '@/types';
import Navbar from '@/components/Navbar';

export default function CategoriesPage() {

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // form state
    const [name, setName] = useState('');
    const [type, setType] = useState('INCOME');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (err: any) {
            setError('Failed to load categories');
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
                await api.put(`/categories/${editingId}`, { name, type });
            } else {
                await api.post('/categories', { name, type });
            }
            setName('');
            setType('INCOME');
            setEditingId(null);
            fetchCategories();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Something went wrong');
        } finally {
            setFormLoading(false);
        }
    };

    const handleEdit = (category: Category) => {
        setEditingId(category.id);
        setName(category.name);
        setType(category.type);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this category?')) return;
        try {
            await api.delete(`/categories/${id}`);
            fetchCategories();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to delete category');
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setName('');
        setType('INCOME');
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <p className="text-gray-600">Loading...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar activePage="categories" />

            <main className="max-w-6xl mx-auto px-6 py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Categories</h2>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Add/Edit Form */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            {editingId ? 'Edit Category' : 'Add Category'}
                        </h3>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. Salary, Food"
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Type
                                </label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="INCOME">Income</option>
                                    <option value="EXPENSE">Expense</option>
                                </select>
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
                                        onClick={handleCancelEdit}
                                        className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md text-sm font-medium hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Categories List */}
                    <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">
                                Your Categories ({categories.length})
                            </h3>

                            {categories.length === 0 ? (
                                <p className="text-gray-500 text-sm">No categories yet. Add your first one!</p>
                            ) : (
                                <div className="space-y-2">
                                    {categories.map((category) => (
                                        <div
                                            key={category.id}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                                    category.type === 'INCOME'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {category.type}
                                                </span>
                                                <span className="text-sm text-gray-800 font-medium">
                                                    {category.name}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="text-xs text-blue-600 hover:underline"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
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