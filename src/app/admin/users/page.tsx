"use client";

import { Users, Search } from "lucide-react";

// Mock Data
const USERS = [
    { id: 1, name: "Budi Santoso", email: "budi@example.com", joinedAt: "2024-01-15" },
    { id: 2, name: "Siti Aminah", email: "siti@example.com", joinedAt: "2024-01-18" },
    { id: 3, name: "John Doe", email: "john@doe.com", joinedAt: "2024-01-20" },
];

export default function UsersPage() {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
                    <p className="text-gray-500">View and manage registered users.</p>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-semibold">ID</th>
                            <th className="p-4 font-semibold">Name</th>
                            <th className="p-4 font-semibold">Email</th>
                            <th className="p-4 font-semibold">Joined Date</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {USERS.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50/50">
                                <td className="p-4 text-gray-500">#{user.id}</td>
                                <td className="p-4 font-medium text-gray-800 flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold mr-3">
                                        {user.name.charAt(0)}
                                    </div>
                                    {user.name}
                                </td>
                                <td className="p-4 text-gray-600">{user.email}</td>
                                <td className="p-4 text-gray-600">{user.joinedAt}</td>
                                <td className="p-4 text-right">
                                    <button className="text-secondary hover:underline text-sm font-medium">View Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
