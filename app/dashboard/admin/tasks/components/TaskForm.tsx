// TaskForm.tsx
"use client";
import React, { useState, useEffect } from "react";

interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: string;
  assignedTo: { username: string };
}

interface TaskFormProps {
  onSave: (task: Omit<Task, "id">) => void;
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSave, onClose }) => {
  const [formState, setFormState] = useState<Omit<Task, "id">>({
    title: "",
    description: "",
    deadline: "",
    status: "",
    assignedTo: { username: "" },
  });

  const [students, setStudents] = useState<{ username: string }[]>([]);

  useEffect(() => {
    fetch("/api/siswa")
      .then((response) => response.json())
      .then((data) => {
        if (data.siswa) {
          setStudents(data.siswa);
        }
      })
      .catch((error) => {
        console.error("Error fetching data from API:", error);
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "assignedTo") {
      setFormState((prev) => ({
        ...prev,
        assignedTo: { username: value },
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    if (!formState.assignedTo.username) {
      alert("Assigned username is required");
      return;
    }

    try {
      const response = await fetch("/api/admin/tasks", {
        method: "POST",
        body: JSON.stringify({
          ...formState,
          assignedTo: formState.assignedTo,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (!response.ok) {
        alert(`Error: ${data.error || "Something went wrong"}`);
      } else {
        onSave(data);
        onClose();
      }
    } catch (error) {
      console.error("Error while saving task:", error);
      alert("An error occurred while saving the task.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create Task</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formState.title}
            onChange={handleChange}
            placeholder="Enter task title"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            name="description"
            value={formState.description}
            onChange={handleChange}
            placeholder="Enter task description"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Deadline</label>
          <input
            type="date"
            name="deadline"
            value={formState.deadline}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={formState.status}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Assigned To</label>
          <select
            name="assignedTo"
            value={formState.assignedTo.username}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Username</option>
            {students.map((student, index) => (
              <option key={index} value={student.username}>
                {student.username}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Save Task
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
