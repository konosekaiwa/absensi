// app/intern/reports/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface Report {
  id: number;
  internId: number;
  internName: string;
  date: string;
  activityDescription: string;
  attendanceStatus: string;
}

interface AvailableMonth {
  year: number;
  month: number;
  label: string;
}

interface ReportData {
  reports: Report[];
  availableMonths: AvailableMonth[];
  currentMonth: {
    year: number;
    month: number;
  };
}

export default function InternReportPage() {
  const { data: session, status } = useSession();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(''); // Format: "YYYY-MM"

  useEffect(() => {
    const fetchReports = async () => {
      if (status === 'loading') return;
      
      if (!session?.user) {
        setError('Please login to view reports');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const now = new Date();
        const year = selectedMonth ? parseInt(selectedMonth.split('-')[0]) : now.getFullYear();
        const month = selectedMonth ? parseInt(selectedMonth.split('-')[1]) : now.getMonth() + 1;

        const res = await fetch(
          `/api/intern/reports/${session.user.id}?year=${year}&month=${month}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch reports: ${res.status} ${res.statusText}`);
        }

        const data: ReportData = await res.json();
        setReportData(data);
        
        // Set initial selected month if not set
        if (!selectedMonth) {
          setSelectedMonth(`${data.currentMonth.year}-${String(data.currentMonth.month).padStart(2, '0')}`);
        }
      } catch (error: any) {
        setError(error.message || 'Failed to fetch reports');
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [session, status, selectedMonth]);

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Please login to view reports</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Intern Reports</h1>
        
        {reportData?.availableMonths && (
          <select
            value={selectedMonth}
            onChange={(e) => handleMonthChange(e.target.value)}
            className="px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {reportData.availableMonths.map((month) => (
              <option
                key={`${month.year}-${month.month}`}
                value={`${month.year}-${String(month.month).padStart(2, '0')}`}
              >
                {format(new Date(month.year, month.month - 1), 'MMMM yyyy', { locale: id })}
              </option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <div className="text-center py-8">Loading reports...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : reportData?.reports && (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kegiatan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.reports.map((report, index) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(report.date), 'EEEE, d MMMM yyyy', {
                        locale: id,
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {report.activityDescription}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`font-medium ${
                          report.attendanceStatus === 'PRESENT'
                            ? 'text-green-500'
                            : report.attendanceStatus === 'ABSENT'
                            ? 'text-red-500'
                            : 'text-gray-500'
                        }`}
                      >
                        {report.attendanceStatus === 'PRESENT'
                          ? 'Hadir'
                          : report.attendanceStatus === 'ABSENT'
                          ? 'Tidak Hadir'
                          : 'Belum Ada Status'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}