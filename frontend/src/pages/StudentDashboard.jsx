import { useEffect, useState } from "react";
import API from "../services/api";
import { Sidebar } from "../components/SideBar";
import { Chat } from "../components/Chat";
import { Notifications } from "../components/Notifications";
import { Bar } from "react-chartjs-2";

export function StudentDashboard() {
  const [results, setResults] = useState([]);
  const [notifications, setNotifications] = useState(0);

  // Fetch student results
  useEffect(() => {
    API.get("student-results/").then((res) => setResults(res.data));
  }, []);

  // Fetch notifications
  useEffect(() => {
    API.get("notifications/").then((res) => {
      setNotifications(res.data.count);
    });
  }, []);

  const chartData = {
    labels: results.map((r) => `Exam ${r.exam}`),
    datasets: [
      {
        data: results.map((r) => r.marks_obtained),
      },
    ],
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
          <Bar data={chartData} />
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