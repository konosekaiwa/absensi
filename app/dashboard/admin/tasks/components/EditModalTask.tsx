import React, { useState, useEffect } from "react";
import { TaskForEdit } from "../../../../lib/types"; // Import TaskForEdit type

interface EditTaskModalProps {
  task: TaskForEdit | null;
  onClose: () => void;
  onSave: (task: TaskForEdit) => void;
}

const EditModalTask: React.FC<EditTaskModalProps> = ({ task, onClose, onSave }) => {
  if (!task) return null; // If no task, don't render the modal

  const [updatedTask, setUpdatedTask] = useState<TaskForEdit>(task);
  const [students, setStudents] = useState<{ username: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/siswa")
      .then((response) => response.json())
      .then((data) => {
        if (data.siswa) {
          setStudents(data.siswa);
        }
      })
      .catch((error) => {
        console.error("Error fetching student data:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "assignedTo") {
      const newAssignedTo = value ? { username: value } : null;
      setUpdatedTask({
        ...updatedTask,
        assignedTo: newAssignedTo,
      });
    } else {
      setUpdatedTask({
        ...updatedTask,
        [name]: value,
      });
    }
  };

  const handleSave = () => {
    onSave(updatedTask); // Pass updated task to parent
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit Task</h2>

        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={updatedTask.title}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={updatedTask.description}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Deadline</label>
              <input
                type="text"
                name="deadline"
                value={updatedTask.deadline}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Assigned To</label>
              <select
                name="assignedTo"
                value={updatedTask.assignedTo?.username || ""}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm"
              >
                <option value="">Not Assigned</option>
                {students.map((student) => (
                  <option key={student.username} value={student.username}>
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
                Save Changes
              </button>
              <button
                onClick={onClose}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditModalTask;
