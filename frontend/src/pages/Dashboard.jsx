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
    API.get("classes/").then((res) => setClasses(res.data));
  }, []);

  useEffect(() => {
    API.get("notifications/").then((res) => {
      setNotifications(res.data.count);
    });
  }, []);

  const chartData = {
    labels: ["Classes"],
    datasets: [
      {
        data: [classes.length],
      },
    ],
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