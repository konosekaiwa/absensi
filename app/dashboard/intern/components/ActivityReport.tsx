"use client";
import React, { useEffect, useState } from "react";

const ActivityReport = () => {
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activityId, setActivityId] = useState<number | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch("/api/intern/activities");

        if (!res.ok) {
          throw new Error(`Failed to fetch activity, status: ${res.status}`);
        }

        const data = await res.json();

        if (data) {
          setDescription(data.description);
          setStatus(data.status);
          setActivityId(data.id);
          setIsSubmitted(true);
        }
      } catch (error) {
        console.error("Error fetching activity:", error);
        alert("Failed to fetch activity data.");
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = isEditing ? "PATCH" : "POST";
      const url = isEditing
        ? `/api/intern/activities/${activityId}`
        : "/api/intern/activities";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data) {
        setActivityId(data.id);
        setDescription(data.description);
        setStatus(data.status);
        setIsSubmitted(true);
        setIsEditing(false);
        alert(isEditing ? "Activity report updated!" : "Activity report saved!");
      }
    } catch (error: any) {
      console.error("Error saving report:", error);
      alert(error.message || "Failed to save activity report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const isFieldsDisabled = loading || (!isEditing && isSubmitted);

  return (
    <div
      className={`bg-gray-800 rounded-lg shadow-lg p-6 border ${isSubmitted && !isEditing ? "opacity-60" : "opacity-100"
        } transition-opacity`}
    >
      <h2 className="text-xl font-semibold text-slate-100 mb-6">
        {isSubmitted ? "Activity Report" : "Add Activity Report"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full bg-gray-700 border border-gray-600 rounded-lg p-4 text-gray-300 focus:ring-2 focus:ring-slate-100 focus:border-transparent transition-all duration-200"
          placeholder="Describe your activity..."
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isFieldsDisabled}
          required
        />

        <select
          className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-gray-300"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={isFieldsDisabled}
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Absent">Absent</option>
        </select>

        {/* Mode Add New Report - tampilkan Submit */}
        {!isSubmitted && (
          <button
            type="submit"
            disabled={loading || description.trim() === ""}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-500"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        )}

        {/* Mode View - tampilkan Edit */}
        {isSubmitted && !isEditing && (
          <button
            onClick={handleEdit}
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit Report
          </button>
        )}

        {/* Mode Edit - tampilkan Update */}
        {isSubmitted && isEditing && (
          <button
            type="submit"
            disabled={loading || description.trim() === ""}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-500"
          >
            {loading ? "Updating..." : "Update Report"}
          </button>
        )}
      </form>
    </div>
  );
};

export default ActivityReport;
