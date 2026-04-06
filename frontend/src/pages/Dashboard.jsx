import { useEffect, useState } from "react";
import API from "../Services/api";
import { Sidebar } from "../components/SideBar";
import { Chat } from "../components/Chat";
import { Notifications } from "../components/Notifications";
import { Bar } from "react-chartjs-2";

export function TeacherDashboard() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [notifications, setNotifications] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddClassForm, setShowAddClassForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    date_of_birth: "",
    student_class: "",
    enrollment_date: ""
  });
  const [classFormData, setClassFormData] = useState({
    name: "",
    subject: "",
    teacher: ""
  });
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);

  // Fetch classes
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && API.defaults.headers.common["Authorization"]) {
      API.get("classes/").then((res) => {
        setClasses(res.data.results || res.data);
      }).catch((err) => {
        console.error("Failed to load classes:", err);
        setClasses([]);
      });
    }
  }, []);

  // Fetch subjects and teachers
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && API.defaults.headers.common["Authorization"]) {
      Promise.all([
        API.get("subjects/").catch(() => ({ data: [] })),
        API.get("teachers/").catch(() => ({ data: [] }))
      ]).then(([subjectsRes, teachersRes]) => {
        setSubjects(subjectsRes.data.results || subjectsRes.data || []);
        setTeachers(teachersRes.data.results || teachersRes.data || []);
      });
    }
  }, []);

  // Fetch students with filters
  useEffect(() => {
    fetchStudents();
  }, [searchTerm, gradeFilter, subjectFilter]);

  const fetchStudents = () => {
    const token = localStorage.getItem("token");
    if (token && API.defaults.headers.common["Authorization"]) {
      let url = "students/";
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (gradeFilter) params.append("grade", gradeFilter);
      if (subjectFilter) params.append("subject", subjectFilter);
      if (params.toString()) url += `?${params.toString()}`;

      API.get(url).then((res) => setStudents(res.data.results || res.data)).catch((err) => {
        console.error("Failed to load students:", err);
        setStudents([]);
      });
    }
  };

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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    // Validate form
    if (!formData.first_name || !formData.last_name || !formData.email || 
        !formData.date_of_birth || !formData.student_class || !formData.enrollment_date) {
      alert("Please fill in all required fields");
      return;
    }

    const classId = parseInt(formData.student_class);
    if (isNaN(classId) || classId <= 0) {
      alert("Please select a valid class");
      return;
    }

    // Prepare form data with proper types and date formatting
    const submitData = {
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      email: formData.email.trim(),
      date_of_birth: formData.date_of_birth,
      student_class: classId,
      enrollment_date: formData.enrollment_date
    };

    console.log("Submitting data:", submitData);

    try {
      if (editingStudent) {
        console.log(`Updating student ${editingStudent.id} with:`, submitData);
        await API.put(`students/${editingStudent.id}/`, submitData);
      } else {
        console.log("Creating new student with:", submitData);
        await API.post("students/", submitData);
      }
      fetchStudents();
      setShowAddForm(false);
      setEditingStudent(null);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        date_of_birth: "",
        student_class: "",
        enrollment_date: ""
      });
    } catch (error) {
      console.error("Failed to save student:", error);
      // Log the error response for debugging
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
        alert(`Error (${error.response.status}): ${JSON.stringify(error.response.data)}`);
      } else {
        alert("Failed to save student. Please check the console for details.");
      }
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      first_name: student.first_name,
      last_name: student.last_name,
      email: student.email,
      date_of_birth: student.date_of_birth,
      student_class: student.student_class,
      enrollment_date: student.enrollment_date
    });
    setShowAddForm(true);
  };

  const handleDelete = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await API.delete(`students/${studentId}/`);
      setStudents(students.filter(student => student.id !== studentId));
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student");
    }
  };

  const handleClassFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    // Validate form
    if (!classFormData.name || !classFormData.subject) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      await API.post("classes/", {
        name: classFormData.name,
        subject: parseInt(classFormData.subject),
        teacher: parseInt(classFormData.teacher) || undefined
      });
      // Refresh classes
      API.get("classes/").then((res) => {
        setClasses(res.data.results || res.data);
      });
      setShowAddClassForm(false);
      setClassFormData({
        name: "",
        subject: "",
        teacher: ""
      });
    } catch (error) {
      console.error("Failed to save class:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        alert("Error: " + JSON.stringify(error.response.data));
      }
    }
  };

  const chartData = {
    labels: ["Classes", "Students"],
    datasets: [
      {
        label: "Count",
        data: [classes.length, students.length],
        backgroundColor: ["rgba(59, 130, 246, 0.6)", "rgba(34, 197, 94, 0.6)"],
        borderColor: ["rgba(59, 130, 246, 1)", "rgba(34, 197, 94, 1)"],
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
          <Notifications count={notifications} />
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h2 className="text-lg font-semibold mb-4">Overview</h2>
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Class Management */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Class Management</h2>
            <button
              onClick={() => setShowAddClassForm(!showAddClassForm)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {showAddClassForm ? "Cancel" : "Add Class"}
            </button>
          </div>

          {/* Add Class Form */}
          {showAddClassForm && (
            <form onSubmit={handleClassFormSubmit} className="mb-6 p-4 border rounded bg-gray-50">
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Class Name (e.g., Grade 10A)"
                  value={classFormData.name}
                  onChange={(e) => setClassFormData({...classFormData, name: e.target.value})}
                  className="border px-3 py-2 rounded"
                  required
                />
                <select
                  value={classFormData.subject}
                  onChange={(e) => setClassFormData({...classFormData, subject: e.target.value})}
                  className="border px-3 py-2 rounded"
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
                <select
                  value={classFormData.teacher}
                  onChange={(e) => setClassFormData({...classFormData, teacher: e.target.value})}
                  className="border px-3 py-2 rounded"
                >
                  <option value="">Select Teacher (Optional)</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>{teacher.first_name} {teacher.last_name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Add Class
              </button>
            </form>
          )}

          {/* Classes List */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Class Name</th>
                  <th className="px-4 py-2 text-left">Subject</th>
                  <th className="px-4 py-2 text-left">Teacher</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((cls) => (
                  <tr key={cls.id} className="border-t">
                    <td className="px-4 py-2">{cls.name}</td>
                    <td className="px-4 py-2">{cls.subject?.name}</td>
                    <td className="px-4 py-2">{cls.teacher ? `${cls.teacher.first_name} ${cls.teacher.last_name}` : 'Not assigned'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Student Management */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Student Management</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {showAddForm ? "Cancel" : "Add Student"}
            </button>
          </div>

          {/* Search and Filter */}
          <div className="mb-4 flex gap-4">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border px-3 py-2 rounded flex-1"
            />
            <input
              type="text"
              placeholder="Filter by grade..."
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Filter by subject..."
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="border px-3 py-2 rounded"
            />
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <form onSubmit={handleFormSubmit} className="mb-6 p-4 border rounded bg-gray-50">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  className="border px-3 py-2 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  className="border px-3 py-2 rounded"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="border px-3 py-2 rounded"
                  required
                />
                <input
                  type="date"
                  placeholder="Date of Birth"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                  className="border px-3 py-2 rounded"
                  required
                />
                <select
                  value={formData.student_class}
                  onChange={(e) => setFormData({...formData, student_class: e.target.value})}
                  className="border px-3 py-2 rounded"
                  required
                >
                  <option value="">Select Class</option>
                  {classes.length === 0 ? (
                    <option disabled>No classes available. Please create classes first.</option>
                  ) : (
                    classes.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.name} - {cls.subject?.name}</option>
                    ))
                  )}
                </select>
                <input
                  type="date"
                  placeholder="Enrollment Date"
                  value={formData.enrollment_date}
                  onChange={(e) => setFormData({...formData, enrollment_date: e.target.value})}
                  className="border px-3 py-2 rounded"
                  required
                />
              </div>
              <button type="submit" className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                {editingStudent ? "Update Student" : "Add Student"}
              </button>
            </form>
          )}

          {/* Students Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Grade</th>
                  <th className="px-4 py-2 text-left">Subject</th>
                  <th className="px-4 py-2 text-left">Attendance</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-t">
                    <td className="px-4 py-2">{student.first_name} {student.last_name}</td>
                    <td className="px-4 py-2">{student.email}</td>
                    <td className="px-4 py-2">{student.grade}</td>
                    <td className="px-4 py-2">{student.subject}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        student.attendance_flag ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {student.attendance_percentage}%
                      </span>
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(student)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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