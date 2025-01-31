"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "../../ui/admin/Button";
import Card from "../../ui/admin/Card";
import AttendancePage from "../../ui/admin/AttendancePage";
import AdminLayout from "../../ui/admin/AdminLayout";
import AddAttendanceModal from "./components/AddAttendanceModal"; // Import the modal component

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const [data, setData] = useState<any[]>([]);
  const [dataSiswa, setDataSiswa] = useState<number>(0);
  const [totalTasks, setTotalTasks] = useState<number>(0); // Store total tasks
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") {
      router.push("/login");
    } else {
      fetchData();
    }
  }, [session, status, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const attendanceResponse = await fetch("/api/admin/attendance");
      if (!attendanceResponse.ok) throw new Error("Network response was not ok");
      const attendanceData = await attendanceResponse.json();
      setData(attendanceData);

      const internResponse = await fetch("/api/siswa");
      if (!internResponse.ok) throw new Error("Failed to fetch intern count");
      const internData = await internResponse.json();
      setDataSiswa(internData.count);

      // Fetch the tasks from the API and count the number of records
      const tasksResponse = await fetch("/api/admin/tasks");
      if (!tasksResponse.ok) throw new Error("Failed to fetch task data");
      const tasksData = await tasksResponse.json();
      
      // Count the number of tasks
      setTotalTasks(tasksData.length); // Assuming tasksData is an array of tasks
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAttendance = (newAttendance: { name: string; status: string }) => {
    setData((prevData) => [
      ...prevData,
      { ...newAttendance, date: new Date().toISOString() },
    ]);
  };

  if (status === "loading" || !session) return <p>Loading...</p>;

  return (
    <AdminLayout>
      <div className="flex flex-col space-y-6 overflow-x-scroll">
        <h1 className="text-4xl font-bold mt-3 text-left">Dashboard Admin</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card title="Total Interns" value={dataSiswa} />
          <Card
            title="Attendance Today"
            value={
              data.filter(
                (item) =>
                  new Date(item.date).toLocaleDateString() ===
                  new Date().toLocaleDateString()
              ).length
            }
          />
          <Card title="Total Tasks" value={totalTasks} /> {/* Card for tasks */}
        </div>

        <div className="flex justify-between items-center mt-6">
          <h2 className="text-xl font-semibold">Attendance Records</h2>
          <Button onClick={() => setModalOpen(true)} label="Add Attendance" />
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="mt-6">
            <AttendancePage data={data} />
          </div>
        )}

        {/* Render the custom modal */}
        <AddAttendanceModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onAddAttendance={handleAddAttendance}
        />
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
