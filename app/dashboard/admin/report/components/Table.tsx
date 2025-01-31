import React, { useMemo, useEffect, useState } from "react";

interface Activity {
  description: string;
}

interface ReportData {
  date: string;
  activities: Activity[];
  status: string;
  remarks: string;
}

interface TableProps {
  data: ReportData[];
  selectedYear: string;
  selectedMonth: string;
  internName: string;
}

const Table: React.FC<TableProps> = ({ data, selectedYear, selectedMonth, internName }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Table component data:", data);
    setLoading(false);
  }, [data]);

  const getDaysInMonth = (year: number, month: number) => {
    try {
      const days = new Date(year, month, 0).getDate();
      if (isNaN(days)) {
        throw new Error("Invalid date calculation.");
      }
      return days;
    } catch (error) {
      console.error("Error getting days in month:", error);
      return 0;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };
      return date.toLocaleDateString("id-ID", options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const formatStatus = (status: string): string => {
    const upperStatus = status.toUpperCase();
    if (upperStatus === 'PRESENT') return 'HADIR';
    return upperStatus;
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PRESENT':
      case 'HADIR':
        return 'text-green-600';
      case 'IZIN':
        return 'text-yellow-600';
      case 'SAKIT':
        return 'text-orange-600';
      case 'TIDAK HADIR':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const daysInMonth = getDaysInMonth(Number(selectedYear), Number(selectedMonth));

  if (daysInMonth === 0) {
    return (
      <div className="p-4">
        <p className="text-sm text-gray-600">Terjadi kesalahan dalam menghitung jumlah hari pada bulan tersebut.</p>
      </div>
    );
  }

  const daysArray = useMemo(() => Array.from({ length: daysInMonth }, (_, index) => index + 1), [daysInMonth]);

  const handlePrint = () => {
    try {
      const printContent = document.getElementById("printable-table");
      if (!printContent) {
        throw new Error("Unable to find the content to print.");
      }

      const printWindow = window.open("", "", "height=600,width=800");
      if (!printWindow) {
        throw new Error("Unable to open print window.");
      }

      printWindow.document.write(
        `<html><head><title>Cetak Laporan</title><style>body{font-family: Arial, sans-serif; margin: 20px;} table {border-collapse: collapse; width: 100%;} th, td {border: 1px solid #ddd; padding: 8px; text-align: left;} th {background-color: #f2f2f2;}</style></head><body>`
      );
      printWindow.document.write(`<h2 style="text-align: center;">Laporan untuk ${internName}</h2>`);
      printWindow.document.write(printContent.innerHTML);
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.print();
    } catch (error) {
      console.error("Error printing:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <p className="text-sm text-gray-600">Menunggu data laporan...</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow-lg rounded-lg">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Laporan untuk {internName}</h1>
        <button
          onClick={handlePrint}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Cetak Laporan
        </button>
      </div>

      <div id="printable-table">
        <table className="min-w-full table-auto bg-white border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-200 text-gray-600">
              <th className="px-4 py-2 text-xs font-medium uppercase tracking-wider text-left border-b border-gray-300">No</th>
              <th className="px-4 py-2 text-xs font-medium uppercase tracking-wider text-left border-b border-gray-300">Tanggal</th>
              <th className="px-4 py-2 text-xs text-center font-medium uppercase tracking-wider border-b border-gray-300">Aktivitas</th>
              <th className="px-4 py-2 text-xs text-center font-medium uppercase tracking-wider border-b border-gray-300">Status Kehadiran</th>
            </tr>
          </thead>
          <tbody>
            {daysArray.map((day, index) => {
              const formattedDate = `${selectedYear}-${String(Number(selectedMonth)).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              
              const reportForDay = data.find(item => item.date === formattedDate);
              
              const activity = reportForDay?.activities[0];
              const activityDescription = activity ? activity.description : " - ";
              const rawStatus = reportForDay ? reportForDay.status : "Tidak ada keterangan";
              const attendanceStatus = formatStatus(rawStatus);

              return (
                <tr key={index} className="hover:bg-slate-100">
                  <td className="px-4 py-2 text-sm border-b border-gray-300">{index + 1}</td>
                  <td className="px-4 py-2 text-sm border-b border-gray-300">{formatDate(formattedDate)}</td>
                  <td className="px-4 py-2 text-sm text-center border-b border-gray-300">{activityDescription}</td>
                  <td className={`px-4 py-2 text-sm text-center border-b border-gray-300 ${getStatusColor(rawStatus)}`}>
                    {attendanceStatus}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;