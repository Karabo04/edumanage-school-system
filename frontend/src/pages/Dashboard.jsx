import { useEffect, useState } from "react";
import API from "../Services/api";
import { Sidebar } from "../components/SideBar";
import { Chat } from "../components/Chat";
import { Notifications } from "../components/Notifications";
import { Bar } from "react-chartjs-2";

export function TeacherDashboard() {
  const [classes, setClasses] = useState([]);
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && API.defaults.headers.common["Authorization"]) {
      API.get("classes/").then((res) => setClasses(res.data.results || res.data)).catch((err) => {
        console.error("Failed to load classes:", err);
        setClasses([]);
      });
    }
  }, []);

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

  const chartData = {
    labels: ["Classes"],
    datasets: [
      {
        label: "Number of Classes",
        data: [classes.length],
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
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
      <Sidebar role="teacher" />

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Teacher Panel</h1>

          {/* Notifications */}
          <Notifications count={notifications} />
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h2 className="text-lg font-semibold mb-4">Overview</h2>
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