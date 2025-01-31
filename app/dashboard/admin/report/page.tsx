"use client";

import React, { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Table from "./components/Table";
import AdminLayout from "@/app/ui/admin/AdminLayout";
import { Spinner } from "./components/Spinner";

interface ApiResponse {
  userId: number;
  username: string;
  role: string;
  sekolah: string;
  jurusan: string;
  attendance: {
    date: string;
    status: string;
  }[];
  activities: {
    date: string;
    description: string;
    taskTitle: string;
  }[];
}

interface ReportData {
  date: string;
  activities: {
    description: string;
  }[];
  status: string;
  remarks: string;
}

const ReportPage = () => {
  const [filters, setFilters] = useState<{
    userId: string;
    year: string;
    month: string;
  }>({
    userId: "",
    year: "",
    month: "",
  });
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [internName, setInternName] = useState<string>("");

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/siswa");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      if (Array.isArray(data.siswa)) {
        setUsers(data.siswa);
      } else {
        setError("Invalid user data format.");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setError(`There was an issue fetching users: ${errorMessage}. Please try again.`);
    }
  };

  const fetchReportData = async () => {
    if (!filters.userId || !filters.year || !filters.month) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/admin/reports/data?userId=${filters.userId}&year=${filters.year}&month=${filters.month}`
      );
      if (!response.ok) throw new Error("Failed to fetch report data");
      const apiData: ApiResponse = await response.json();

      console.log("API Response:", apiData);

      // Create a map of attendance status by date
      const attendanceByDate = Object.fromEntries(
        apiData.attendance.map(att => [att.date, att.status])
      );

      // Create a map of activities by date
      const activitiesByDate = Object.fromEntries(
        apiData.activities.map(act => [act.date, {
          description: act.description,
          taskTitle: act.taskTitle
        }])
      );

      // Get all unique dates from both attendance and activities
      const allDates = [...new Set([
        ...apiData.attendance.map(a => a.date),
        ...apiData.activities.map(a => a.date)
      ])].sort();

      // Transform data combining attendance and activities
      const transformedData: ReportData[] = allDates.map(date => ({
        date,
        activities: [{
          description: activitiesByDate[date]?.description || "Tidak ada aktivitas"
        }],
        status: attendanceByDate[date] || "TIDAK HADIR",
        remarks: activitiesByDate[date]?.taskTitle || "Tidak ada tugas"
      }));

      console.log("Transformed Data:", transformedData);
      setReportData(transformedData);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setError(`There was an issue fetching the report data: ${errorMessage}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (filters.userId && filters.year && filters.month) {
      fetchReportData();
    }
  }, [filters]);

  useEffect(() => {
    const selectedUser = users.find(
      (user) => String(user.id) === String(filters.userId)
    );
    setInternName(selectedUser ? selectedUser.username : "");
  }, [filters.userId, users]);

  return (
    <AdminLayout>
      <div className="p-4">
        <Filter
          users={users}
          onFilterChange={(newFilters) => setFilters(newFilters)}
        />

        {loading ? (
          <div className="flex justify-center my-4">
            <Spinner />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : filters.userId && filters.year && filters.month ? (
          <div className="mt-4">
            <Table
              data={reportData}
              selectedYear={filters.year}
              selectedMonth={filters.month}
              internName={internName}
            />
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-4">
            Please select a user, year, and month to view the report.
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ReportPage;