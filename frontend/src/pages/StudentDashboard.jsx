import { useEffect, useState } from "react";
import API from "../Services/api";
import { Sidebar } from "../components/SideBar";
import { Chat } from "../components/Chat";
import { Notifications } from "../components/Notifications";
import { Bar } from "react-chartjs-2";

export function StudentDashboard() {
  const [results, setResults] = useState([]);
  const [notifications, setNotifications] = useState(0);
  const [profile, setProfile] = useState(null);

  // Fetch student profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && API.defaults.headers.common["Authorization"]) {
      API.get("my-profile/").then((res) => {
        setProfile(res.data);
      }).catch((err) => {
        console.error("Failed to load profile:", err);
        setProfile(null);
      });
    }
  }, []);

  // Fetch student results
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && API.defaults.headers.common["Authorization"]) {
      API.get("my-results/").then((res) => {
        // Handle paginated response - extract results array
        const resultsData = res.data?.results || res.data || [];
        setResults(Array.isArray(resultsData) ? resultsData : []);
      }).catch((err) => {
        console.error("Failed to load results:", err);
        setResults([]);
      });
    }
  }, []);

  // Fetch notifications
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && API.defaults.headers.common["Authorization"]) {
      API.get("notifications/").then((res) => {
        setNotifications(res.data.count || 0);
      }).catch((err) => {
        console.error("Failed to load notifications:", err);
        setNotifications(0);
      });
    }
  }, []);

  const chartData = results && results.length > 0 ? {
    labels: results.map((r) => `Exam ${r.exam || r.id || 'Unknown'}`),
    datasets: [
      {
        label: "Percentage",
        data: results.map((r) => r.percentage || 0),
        backgroundColor: "rgba(34, 197, 94, 0.6)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
      },
    ],
  } : {
    labels: ['No Data'],
    datasets: [{
      label: "Percentage",
      data: [0],
      backgroundColor: "rgba(156, 163, 175, 0.6)",
      borderColor: "rgba(156, 163, 175, 1)",
      borderWidth: 1,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar role="student" />

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Student Panel</h1>

          <Notifications count={notifications} />
        </div>

        {/* Attendance Section */}
        {profile && (
          <div className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="text-lg font-semibold mb-4">Attendance Overview</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Attendance Percentage:</span>
                <span className={`font-bold ${profile.attendance_flag ? 'text-red-600' : 'text-green-600'}`}>
                  {profile.attendance_percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full ${profile.attendance_flag ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(profile.attendance_percentage, 100)}%` }}
                ></div>
              </div>
              {profile.attendance_flag && (
                <p className="text-red-600 text-sm">⚠️ Your attendance is below 70%. Please improve your attendance.</p>
              )}
            </div>
          </div>
        )}

        {/* Results Chart */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h2 className="text-lg font-semibold mb-4">My Results</h2>
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Results Table */}
        {results.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="text-lg font-semibold mb-4">Detailed Results</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Exam</th>
                    <th className="px-4 py-2 text-left">Marks</th>
                    <th className="px-4 py-2 text-left">Percentage</th>
                    <th className="px-4 py-2 text-left">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">Exam {result.exam}</td>
                      <td className="px-4 py-2">{result.marks_obtained}</td>
                      <td className="px-4 py-2">{result.percentage?.toFixed(2)}%</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded ${
                          result.grade === 'Distinction' ? 'bg-green-100 text-green-800' :
                          result.grade === 'Merit' ? 'bg-blue-100 text-blue-800' :
                          result.grade === 'Pass' ? 'bg-yellow-100 text-yellow-800' :
                          result.grade === 'Symbol E' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {result.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Chat Section */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h2 className="text-lg font-semibold mb-4">Messages</h2>
          <Chat />
        </div>

      </main>
    </div>
  );
}