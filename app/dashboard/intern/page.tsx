"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import IdentityCard from "./components/IdentityCard";
import TaskCard from "./components/TaskCard";
import ActivityReport from "./components/ActivityReport";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

interface Activity {
  id: number;
  description: string;
  status: string;
  date: string;
}

interface InternData {
  id: number;
  username: string;
  sekolah: string;
  jurusan: string;
  dateOfBirth: string;
  tanggalMasuk: string;
  tanggalKeluar: string;
  tasks: Task[];
  activities: Activity[];
}

const InternDashboard = () => {
  const [internData, setInternData] = useState<InternData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/intern");
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();
        setInternData(data);
      } catch (error: any) {
        console.error("Error fetching intern data:", error);
        setError(error.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTaskStatusChange = (id: number, status: string) => {
    if (internData) {
      const updatedTasks = internData.tasks.map((task) => {
        if (task.id === id) {
          return { ...task, status };
        }
        return task;
      });
      setInternData({ ...internData, tasks: updatedTasks });
    }
  };

  const activeTasks = internData?.tasks.filter(task => task.status !== "Completed") || [];
  const completedTasks = internData?.tasks.filter(task => task.status === "Completed") || [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!internData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>No data available for the current user.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen border rounded-xl bg-gray-900">
      <main className="pt-1">
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-3">
          {/* Identity Card */}
          <IdentityCard data={internData} />

          {/* Task Section */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-blue-400">Task List</h2>
              <button
                onClick={() => setShowCompletedTasks(true)}
                className="text-sm text-blue-400 hover:text-blue-300 transition"
              >
                View Completed Tasks
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {activeTasks.length === 0 ? (
                <p className="text-gray-400">No tasks remaining. Good job!</p>
              ) : (
                activeTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onTaskStatusChange={handleTaskStatusChange}
                  />
                ))
              )}
            </div>
          </div>

          {/* Modal for Completed Tasks */}
          {showCompletedTasks && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div
                className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full transform transition-all duration-300 scale-100"
              >
                {/* Header Modal */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-blue-400">Completed Tasks</h3>
                  <button
                    onClick={() => setShowCompletedTasks(false)}
                    className="text-gray-400 hover:text-gray-300 transition"
                  >
                    ✕
                  </button>
                </div>

                {/* List of Completed Tasks */}
                <ul className="space-y-4 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                  {completedTasks.length > 0 ? (
                    completedTasks.map((task) => (
                      <li
                        key={task.id}
                        className="bg-gray-700 p-4 rounded-lg flex flex-col gap-2"
                      >
                        <p className="text-blue-300 font-medium">{task.title}</p>
                        <p className="text-sm text-gray-300">{task.description}</p>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-400 text-center">No completed tasks yet.</p>
                  )}
                </ul>

                {/* Footer Modal */}
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setShowCompletedTasks(false)}
                    className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-400 transition shadow-md"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}


          {/* Activity Report Section */}
          <ActivityReport />
        </div>
      </main>
    </div>
  );
};

export default InternDashboard;
