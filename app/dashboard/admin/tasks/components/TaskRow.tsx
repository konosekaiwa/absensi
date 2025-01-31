import React from "react";
import { TaskForTable } from "../../../../lib/types";
import { Tooltip, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface TaskRowProps {
  task: TaskForTable;
  onEdit: (task: TaskForTable) => void;
  onDelete: (id: number) => void;
}

const TaskRow: React.FC<TaskRowProps> = ({ task, onEdit, onDelete }) => {
  return (
    <tr className="border-b hover:bg-gray-100">
      <td className="py-3 px-6 text-sm font-medium text-gray-700">{task.title}</td>
      <td className="py-3 px-6 text-sm text-gray-500">{task.description}</td>
      <td className="py-3 px-6 text-sm">{task.deadline}</td>
      <td className="py-3 px-6 text-sm">{task.status}</td>
      <td className="py-3 px-6 text-sm">
        {task.assignedTo?.username || "Not Assigned"}
      </td>

      <td className="py-3 px-6 text-sm flex items-center space-x-4">
        <Tooltip title="Edit">
          <IconButton onClick={() => onEdit(task)} color="primary">
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton onClick={() => onDelete(task.id)} color="error">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </td>
    </tr>
  );
};

export default TaskRow;
