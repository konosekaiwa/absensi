import { useState } from 'react';
import Button from '../../../ui/admin/Button';

interface AddAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAttendance: (attendance: { name: string; status: string }) => void;
}

const AddAttendanceModal = ({ isOpen, onClose, onAddAttendance }: AddAttendanceModalProps) => {
  const [newAttendance, setNewAttendance] = useState({ name: '', status: 'Present' });

  const handleAdd = () => {
    onAddAttendance(newAttendance);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-semibold mb-4">Add Attendance</h2>
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Name</label>
          <input
            type="text"
            id="name"
            className="mt-1 p-2 border border-gray-300"
            value={newAttendance.name}
            onChange={(e) => setNewAttendance({ ...newAttendance, name: e.target.value })}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="status" className="block text-sm font-medium">Status</label>
          <select
            id="status"
            className="mt-1 p-2 border border-gray-300"
            value={newAttendance.status}
            onChange={(e) => setNewAttendance({ ...newAttendance, status: e.target.value })}
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <Button label="Cancel" onClick={onClose} />
          <Button label="Add" onClick={handleAdd} />
        </div>
      </div>
    </div>
  );
};

export default AddAttendanceModal;
