import React, { useState, useMemo } from "react";
import EditTaskModal from "./EditModalTask";
import TaskRow from "./TaskRow";
import { TaskForTable } from "../../../../lib/types";

interface TaskTableProps {
  tasks: TaskForTable[];
  onEdit: (task: TaskForTable) => void;
  onDelete: (id: number) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, onEdit, onDelete }) => {
  const [selectedTask, setSelectedTask] = useState<TaskForTable | null>(null);
  const [filter, setFilter] = useState({ status: "", sortBy: "title" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter tasks based on status and sort
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Filter by status only
        const matchesStatus = task.status.toLowerCase().includes(filter.status.toLowerCase());
        return matchesStatus;
      })
      .sort((a, b) => {
        // Sort by the selected option (title or deadline)
        if (filter.sortBy === "title") {
          return a.title.localeCompare(b.title);
        } else if (filter.sortBy === "deadline") {
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
        return 0;
      });
  }, [tasks, filter]);

  // Pagination setup
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  // Get tasks for current page
  const currentTasks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredTasks.slice(start, end);
  }, [filteredTasks, currentPage]);

  // Open modal for editing
  const handleEdit = (task: TaskForTable) => {
    setSelectedTask(task);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  // Save changes from modal
  const handleSave = (updatedTask: TaskForTable) => {
    onEdit(updatedTask); // Pass updated task to parent
    handleCloseModal(); // Close modal after save
  };

  // Memoize task rows to optimize rendering
  const taskRows = useMemo(
    () =>
      currentTasks.map((task) => (
        <TaskRow key={task.id} task={task} onEdit={handleEdit} onDelete={onDelete} />
      )),
    [currentTasks, onDelete]
  );

  // Handle filter change (status and sort)
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  // Handle pagination change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {/* Filter Section (Dropdown for Status and Sort) */}
      <div className="mb-4 flex space-x-4">
        <select
          name="status"
          value={filter.status}
          onChange={handleFilterChange}
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
        >
          <option value="">Filter by Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="in progress">In Progress</option>
        </select>
        <select
          name="sortBy"
          value={filter.sortBy}
          onChange={handleFilterChange}
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
        >
          <option value="title">Sort by Title</option>
          <option value="deadline">Sort by Deadline</option>
        </select>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full table-auto bg-white">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Deadline</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Assigned To</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {taskRows.length > 0 ? (
              taskRows
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-3 px-6">
                  No tasks available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center space-x-2">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-300"
        >
          {"<<"} First
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-300"
        >
          {"<"} Prev
        </button>
        <span className="py-2 px-4 text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-300"
        >
          Next {">"}
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-300"
        >
          Last {">>"}
        </button>
      </div>

      {/* Edit Task Modal */}
      {selectedTask && (
        <EditTaskModal
          task={selectedTask}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default TaskTable;
