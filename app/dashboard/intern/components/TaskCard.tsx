"use client";
import React, { useState } from "react";
import { CheckSquare } from "lucide-react";

const TaskCard = ({
  task,
  onTaskStatusChange,
}: {
  task: { id: number; title: string; description: string; status: string };
  onTaskStatusChange: (id: number, status: string) => void;
}) => {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async () => {
    setLoading(true);
    try {
      // Update status to "Completed" and send to backend
      const response = await fetch(`/api/intern/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Completed" }),
      });

      if (response.ok) {
        onTaskStatusChange(task.id, "Completed"); // Update the status in the frontend
      } else {
        alert("Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("An error occurred while updating task status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <h3 className="text-lg font-semibold text-blue-400 mb-3">{task.title}</h3>
      <p className="text-gray-300 mb-4">{task.description}</p>
      <div className="flex justify-between items-center">
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            task.status === "Completed"
              ? "bg-green-500/20 text-green-400"
              : "bg-yellow-500/20 text-yellow-400"
          }`}
        >
          {task.status}
        </span>
        <div className="flex items-center">
          {task.status !== "Completed" && (
            <button
              onClick={handleStatusChange}
              disabled={loading}
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center"
            >
              <CheckSquare className="mr-1" size={16} />
              {loading ? "Processing..." : "Mark Complete"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
