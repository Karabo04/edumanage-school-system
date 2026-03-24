from django.urls import path
from .views import StudentView, TeacherView, ClassView, SubjectView, ExamView, ResultView, AttendanceView, signup, login

urlpatterns = [
    path('students/', StudentView.as_view(), name='student-list'),
    path('teachers/', TeacherView.as_view(), name='teacher-list'),
    path('classes/', ClassView.as_view(), name='class-list'),
    path('subjects/', SubjectView.as_view(), name='subject-list'),
    path('exams/', ExamView.as_view(), name='exam-list'),
    path('results/', ResultView.as_view(), name='result-list'),
    path('attendance/', AttendanceView.as_view(), name='attendance-list'),
    path('signup/', signup, name='signup'),
    path('login/', login, name='login'),
]