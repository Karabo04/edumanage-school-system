import { useEffect, useState } from "react";
import API from "../Services/api";
import { Sidebar } from "../components/SideBar";
import { Chat } from "../components/Chat";
import { Notifications } from "../components/Notifications";
import { Bar } from "react-chartjs-2";

export function StudentDashboard() {
  const [results, setResults] = useState([]);
  const [notifications, setNotifications] = useState(0);

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
        label: "Marks Obtained",
        data: results.map((r) => r.marks_obtained || r.score || 0),
        backgroundColor: "rgba(34, 197, 94, 0.6)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
      },
    ],
  } : {
    labels: ['No Data'],
    datasets: [{
      label: "Marks Obtained",
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

        {/* Results Chart */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h2 className="text-lg font-semibold mb-4">My Results</h2>
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Chat Section */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h2 className="text-lg font-semibold mb-4">Messages</h2>
          <Chat />
        </div>

      </main>
    </div>
  );
}