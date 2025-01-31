// app/dashboard/admin/page.tsx

'use client'; // Pastikan ini ada di bagian atas file

import { useEffect, useState } from 'react';
import Button from '../../ui/admin/Button';
import Card from '../../ui/admin/Card';
import AttendancePage from '../../ui/admin/AttendancePage'; // Mengimpor AttendancePage
import AdminLayout from '../../ui/admin/AdminLayout';

const DashboardPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/attendance');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <AdminLayout>
      <div className="flex flex-col space-y-6">
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card title="Total Interns" value={data.length} />
          <Card title="Attendance Today" value={data.filter(item => new Date(item.date).toLocaleDateString() === new Date().toLocaleDateString()).length} />
          <Card title="Total Tasks" value={data.reduce((acc, curr) => acc + (curr.tasks?.length || 0), 0)} />
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Attendance Records</h2>
          <Button onClick={() => console.log('Add Attendance')} label="Add Attendance" />
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <AttendancePage data={data} /> // Menggunakan AttendancePage
        )}
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
