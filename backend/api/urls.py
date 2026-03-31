from django.urls import path
from .views import (
    StudentView, TeacherView, 
    ClassView, SubjectView, 
    ExamView, ResultView, 
    AttendanceView, FeeView,
    StudentProfileView, StudentAttendanceView, StudentResultsView, FeesView,
    MessageView, NotificationView, MarkAsReadView, UsersView,
    signup, login, user_profile
)

urlpatterns = [
    path('students/', StudentView.as_view(), name='student-list'),
    path('teachers/', TeacherView.as_view(), name='teacher-list'),
    path('classes/', ClassView.as_view(), name='class-list'),
    path('subjects/', SubjectView.as_view(), name='subject-list'),
    path('exams/', ExamView.as_view(), name='exam-list'),
    path('results/', ResultView.as_view(), name='result-list'),
    path('attendance/', AttendanceView.as_view(), name='attendance-list'),
    path('fees/', FeeView.as_view(), name='fee-list'),
    # Student-specific endpoints
    path('my-profile/', StudentProfileView.as_view(), name='student-profile'),
    path('my-attendance/', StudentAttendanceView.as_view(), name='student-attendance'),
    path('my-results/', StudentResultsView.as_view(), name='student-results'),
    path('my-fees/', FeesView.as_view(), name='student-fees'),
    path('users/', UsersView.as_view(), name='user-list'),
    path('messages/', MessageView.as_view()),
    path('user-profile/', user_profile, name='user-profile'),
    path('notifications/', NotificationView.as_view()),
    path('mark-read/', MarkAsReadView.as_view()),
    path('sign-up/', signup, name='signup'),
    path('login/', login, name='login'),
]