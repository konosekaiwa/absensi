import React, { useState, useEffect, ReactNode } from "react";

// Tipe untuk user yang dipilih
interface User {
    username: ReactNode;
    id: string;
    name: string;
}

// Tipe untuk props Filter
interface FilterProps {
    users: User[];
    onFilterChange: (filters: { userId: string; year: string; month: string }) => void;
}

const Filter: React.FC<FilterProps> = ({ users, onFilterChange }) => {
    const [selectedUser, setSelectedUser] = useState<string>(""); // State untuk menyimpan user yang dipilih
    const [selectedYear, setSelectedYear] = useState<string>(""); // State untuk menyimpan tahun yang dipilih
    const [selectedMonth, setSelectedMonth] = useState<string>(""); // State untuk menyimpan bulan yang dipilih

    // Fungsi untuk menangani perubahan user
    const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const userId = e.target.value;
        setSelectedUser(userId);
        // Pastikan tahun dan bulan juga sudah dipilih sebelum memanggil onFilterChange
        if (selectedYear && selectedMonth) {
            onFilterChange({ userId, year: selectedYear, month: selectedMonth });
        }
    };

    // Fungsi untuk menangani perubahan tahun
    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const year = e.target.value;
        setSelectedYear(year);
        // Pastikan user dan bulan sudah dipilih sebelum memanggil onFilterChange
        if (selectedUser && selectedMonth) {
            onFilterChange({ userId: selectedUser, year, month: selectedMonth });
        }
    };

    // Fungsi untuk menangani perubahan bulan
    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const month = e.target.value;
        setSelectedMonth(month);
        // Pastikan user dan tahun sudah dipilih sebelum memanggil onFilterChange
        if (selectedUser && selectedYear) {
            onFilterChange({ userId: selectedUser, year: selectedYear, month });
        }
    };

    return (
        <div className="flex items-center space-x-4 mb-4">
            <div>
                <label htmlFor="user" className="block text-sm font-medium text-gray-700">
                    Select Intern
                </label>
                <select
                    id="user"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    onChange={handleUserChange}
                    value={selectedUser} // Menyetel nilai default yang dipilih
                >
                    <option value="">Select Intern</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.username} {/* Menampilkan username */}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                    Select Year
                </label>
                <select
                    id="year"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    onChange={handleYearChange}
                    value={selectedYear} // Menyetel nilai default yang dipilih
                >
                    <option value="">Select Year</option>
                    {[2023, 2024, 2025].map((year) => (
                        <option key={year} value={year.toString()}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="month" className="block text-sm font-medium text-gray-700">
                    Select Month
                </label>
                <select
                    id="month"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    onChange={handleMonthChange}
                    value={selectedMonth} // Menyetel nilai default yang dipilih
                >
                    <option value="">Select Month</option>
                    {[
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                    ].map((month, index) => (
                        <option key={index} value={(index + 1).toString()}>
                            {month}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default Filter;
