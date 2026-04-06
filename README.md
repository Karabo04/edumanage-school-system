# EduManage — School
Management System

System Development N5
Project

 

## About

A browser-based school
management system built with React.

Manage student records,
grades, and attendance.

 

## Student Details

- Name: Karabo Shaun Nqambi

- Student No: 20240219017

- Institution: Eagleview Graduate Institute 

- Year: 2026





## 🚀 Features

### Authentication & User Management
- Role-based Access Control: Separate interfaces for students, teachers, and administrators
- Secure Authentication: Token-based authentication with Django REST Framework
- User Registration: Signup functionality with role assignment
- Profile Management: Personalized user profiles and settings

### Student Portal
- Dashboard: Personalized dashboard with quick access to important information
- Academic Results: Visual representation of exam results with interactive charts
- Attendance Tracking: View personal attendance records
- Fee Management: Track fee payments and outstanding balances
- Notifications: Real-time notifications for important updates

### Teacher Portal
- Class Management: Manage assigned classes and students
- Exam Management: Create and manage examinations
- Result Management: Record and update student exam results
- Attendance Management: Mark and track student attendance
- Communication: Send messages and announcements to students

### Administrative Features
- Student Management: Add, update, and manage student records
- Teacher Management: Manage teaching staff information
- Class Management: Organize classes and assign teachers
- Subject Management: Define curriculum subjects
- Fee Management: Set up and manage fee structures

### Communication System
- Real-time Messaging: Built with Django Channels for WebSocket communication
- Chat Interface: Interactive chat between students and teachers
- Notifications: System-wide notification system
- Message History: Persistent message storage and retrieval

### Data Visualization
- Interactive Charts: Chart.js integration for result visualization
- Performance Analytics: Visual representation of academic performance
- Attendance Reports: Graphical attendance tracking
- Fee Reports: Payment status visualization

## 🛠️ Technology Stack

### Backend
- **Framework**: Django 6.0.3
- **API**: Django REST Framework 3.17.0
- **Database**: SQLite (development) / MySQL (production)
- **Real-time Communication**: Django Channels
- **Authentication**: Token Authentication
- **CORS**: Django CORS Headers

### Frontend
- **Framework**: React 19.2.4
- **Build Tool**: Vite 8.0.1
- **Styling**: Tailwind CSS 3.4.19
- **Charts**: Chart.js 4.5.1 with React-ChartJS-2 5.3.1
- **Routing**: React Router DOM 7.13.2
- **HTTP Client**: Axios 1.13.6

### Development Tools
- **Python Environment**: Virtual environment management
- **Linting**: ESLint for JavaScript/React
- **Package Management**: npm for frontend, pip for backend
- **Environment Configuration**: python-dotenv

## 📁 Project Structure

```
edumanage-school-system/
├── backend/                    # Django backend application
│   ├── api/                   # REST API endpoints
│   ├── students/              # Student management app
│   ├── teachers/              # Teacher management app
│   ├── classes/               # Class management app
│   ├── subjects/              # Subject management app
│   ├── exams/                 # Exam management app
│   ├── results/               # Results management app
│   ├── attendance/            # Attendance tracking app
│   ├── fees/                  # Fee management app
│   ├── messaging/             # Real-time messaging app
│   ├── backend/               # Django project settings
│   ├── db.sqlite3             # SQLite database
│   └── manage.py              # Django management script
├── frontend/                  # React frontend application
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   ├── pages/            # Page components
│   │   ├── Services/         # API service functions
│   │   └── assets/           # Static assets
│   ├── public/               # Public static files
│   └── package.json          # Frontend dependencies
├── requirements.txt           # Python dependencies
└── README.md                 # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Karabo04/edumanage-school-system.git
   cd edumanage-school-system
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv myenv
   source myenv/bin/activate  # On Windows: myenv\Scripts\activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Navigate to backend directory**
   ```bash
   cd backend
   ```

5. **Run database migrations**
   ```bash
   python manage.py migrate
   ```

6. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start the Django development server**
   ```bash
   python manage.py runserver
   ```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. **Open a new terminal and navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

The frontend application will be available at `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3  # For production, use MySQL/PostgreSQL
```

### Database Configuration

The project uses SQLite for development. For production, update the database settings in `backend/backend/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'edumanage_db',
        'USER': 'your_db_user',
        'PASSWORD': 'your_db_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

## 📡 API Endpoints

### Authentication
- `POST /api/login/` - User login
- `POST /api/sign-up/` - User registration

### Student Endpoints
- `GET /api/my-profile/` - Get student profile
- `GET /api/my-results/` - Get student exam results
- `GET /api/my-attendance/` - Get student attendance
- `GET /api/my-fees/` - Get student fee information

### Teacher Endpoints
- `GET/POST /api/students/` - Manage students
- `GET/POST /api/results/` - Manage exam results
- `GET/POST /api/attendance/` - Manage attendance
- `GET/POST /api/exams/` - Manage examinations

### Administrative Endpoints
- `GET/POST /api/classes/` - Manage classes
- `GET/POST /api/subjects/` - Manage subjects
- `GET/POST /api/teachers/` - Manage teachers
- `GET/POST /api/fees/` - Manage fees

### Communication
- `GET/POST /api/messages/` - Send/receive messages
- `GET /api/notifications/` - Get notifications
- `POST /api/mark-read/` - Mark notifications as read

## 🎨 User Interface

### Student Dashboard
- **Results Chart**: Interactive bar chart showing exam performance
- **Attendance Overview**: Visual attendance tracking
- **Fee Status**: Current fee payment information
- **Notifications Panel**: Real-time notifications
- **Messaging Interface**: Chat with teachers

### Teacher Dashboard
- **Class Overview**: Manage assigned classes
- **Student Management**: View and update student information
- **Exam Management**: Create and grade examinations
- **Attendance Management**: Mark student attendance
- **Communication Tools**: Send messages to students

## 🔒 Security Features

- **Token-based Authentication**: Secure API access
- **Role-based Permissions**: Different access levels for different user types
- **CORS Protection**: Cross-origin resource sharing controls
- **Input Validation**: Comprehensive data validation
- **SQL Injection Protection**: Django ORM safeguards

## 📊 Data Models

### Core Entities
- **User**: Authentication and basic user information
- **Student**: Extended student profile with academic information
- **Teacher**: Teacher profile and assignments
- **Class**: Class information and student assignments
- **Subject**: Curriculum subjects
- **Exam**: Examination details and scheduling
- **Result**: Exam results and grades
- **Attendance**: Attendance records
- **Fee**: Fee structures and payments
- **Message**: Communication records

## 🚀 Deployment

### Backend Deployment
1. Set `DEBUG=False` in settings
2. Configure production database
3. Set up static file serving
4. Configure web server (nginx/gunicorn)
5. Set up SSL certificates

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Serve static files from `dist/` directory
3. Configure web server for SPA routing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation for common solutions

## 🔄 Future Enhancements

- [ ] Mobile application development
- [ ] Advanced analytics and reporting
- [ ] Integration with learning management systems
- [ ] Parent portal for communication
- [ ] Automated grading systems
- [ ] Calendar integration for events
- [ ] File upload and document management
- [ ] Multi-language support

---

**Built with ❤️ for educational institutions**