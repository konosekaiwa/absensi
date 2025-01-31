"use client";
import React, { useState, useEffect } from "react";
import TaskTable from "./components/TaskTable";
import TaskForm from "./components/TaskForm";
import AdminLayout from "@/app/ui/admin/AdminLayout";
import { TaskForTable } from "../../../lib/types";
import { CircularProgress } from "@mui/material"; // For loading state

const Page: React.FC = () => {
  const [tasks, setTasks] = useState<TaskForTable[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  // Fetch tasks from the server
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/admin/tasks");
        if (!response.ok) throw new Error("Failed to fetch tasks");
        const data: TaskForTable[] = await response.json();
        setTasks(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Handle saving a new task
  const handleSave = async (task: Omit<TaskForTable, "id">) => {
    try {
      const response = await fetch("/api/admin/tasks", {
        method: "POST",
        body: JSON.stringify(task),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (!response.ok) {
        alert(`Error: ${data.error || "Terjadi kesalahan"}`);
      } else {
        setTasks((prev) => [...prev, data]); // Add the task received from the server
        alert("Task saved successfully!");
        setIsModalOpen(false); // Close modal after saving
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Handle editing an existing task
  const handleEdit = async (updatedTask: TaskForTable) => {
    try {
      const response = await fetch(`/api/admin/tasks`, {
        method: "PUT",
        body: JSON.stringify(updatedTask),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to update task");

      const updatedTaskFromServer = await response.json();
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTaskFromServer : task))
      );
      alert("Task updated successfully!");
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Handle deleting a task
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/tasks`, {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to delete task");

      const deletedTask = await response.json();
      setTasks((prev) => prev.filter((task) => task.id !== deletedTask.id));
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Loading and error state handling
  if (loading) return <CircularProgress className="m-auto mt-16" />;
  if (error) return <div>Error: {error}</div>;

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-semibold">Task Management</h1>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setIsModalOpen(true)} // Open modal on button click
            className="bg-indigo-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-indigo-700 transition duration-300"
          >
            Add New Task
          </button>
        </div>
        <TaskTable
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {isModalOpen && (
        <TaskForm onSave={handleSave} onClose={() => setIsModalOpen(false)} />
      )}
    </AdminLayout>
  );
};

export default Page;
