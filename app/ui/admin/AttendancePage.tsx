import React, { useState } from "react";

interface AttendancePageProps {
  data: any[];
}

type Status = "PRESENT" | "ABSENT";

const AttendancePage: React.FC<AttendancePageProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortField, setSortField] = useState<string>("date"); // Default: Tanggal
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Comparator for different fields
  const compareDate = (a: any, b: any): number => {
    const aDate = new Date(a).getTime();
    const bDate = new Date(b).getTime();
    return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
  };

  const compareString = (a: string, b: string): number => {
    return sortOrder === "asc"
      ? a.localeCompare(b)
      : b.localeCompare(a);
  };

  const compareStatus = (a: Status, b: Status): number => {
    const statusOrder: { [key in Status]: number } = { PRESENT: 1, ABSENT: 0 };
    return sortOrder === "asc"
      ? statusOrder[a] - statusOrder[b]
      : statusOrder[b] - statusOrder[a];
  };

  const compare = (a: any, b: any, field: string): number => {
    if (field === "date") {
      return compareDate(a[field], b[field]);
    } else if (field === "status") {
      return compareStatus(a[field], b[field]);
    } else if (field === "user") {
      return compareString(a[field]?.username || "", b[field]?.username || "");
    }
    return 0;
  };

  const sortData = (data: any[]) => {
    return [...data].sort((a, b) => compare(a, b, sortField));
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedData = sortData(data).slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleSortChange = (field: string) => {
    setSortField(field);
    setSortOrder("asc"); // Set to ascending by default when the user changes sort field
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {/* Sorting Dropdown */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <label className="mr-2 font-medium text-gray-700">Sort by:</label>
          <select
            value={sortField}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Tanggal</option>
            <option value="user">Nama (A-Z)</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-gray-700 text-white">
            <tr>
              <th className="py-4 px-6 text-left font-medium uppercase tracking-wider border-b">
                ID
              </th>
              <th className="py-4 px-6 text-left font-medium uppercase tracking-wider border-b">
                Nama
              </th>
              <th className="py-4 px-6 text-left font-medium uppercase tracking-wider border-b">
                Tanggal
              </th>
              <th className="py-4 px-6 text-left font-medium uppercase tracking-wider border-b">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-4 px-6">{item.id}</td>
                <td className="py-4 px-6">{item.user?.username || "No Name"}</td>
                <td className="py-4 px-6">
                  {new Date(item.date).toLocaleDateString()}
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-white ${
                      item.status === "PRESENT"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <button
          className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <div className="flex items-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg ${
                page === currentPage
                  ? "bg-gray-700 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(prev + 1, Math.ceil(data.length / itemsPerPage))
            )
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AttendancePage;
