export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface AuthResponse {
    token: string;
    name: string;
    email: string;
}

export interface Category {
    id: number;
    name: string;
    type: 'INCOME' | 'EXPENSE';
    user: User;
}

export interface Transaction {
    id: number;
    amount: number;
    description: string;
    date: string;
    category: Category;
    user: User;
}

export interface DashboardData {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    transactionCount: number;
}