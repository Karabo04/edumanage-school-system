import json
from rest_framework import generics, permissions
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db import models
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from messaging.models import Message
from attendance.models import Attendance
from fees.models import Fee
from classes.models import Class
from exams.models import Exam
from results.models import Result
from students.models import Student
from subjects.models import Subject
from teachers.models import Teacher
from .models import UserProfile

from .serializers import (
    StudentSerializer, TeacherSerializer, ClassSerializer, SubjectSerializer,
    ExamSerializer, ResultSerializer, AttendanceSerializer, FeeSerializer,
    UserProfileSerializer, MessageSerializer, UserSerializer
)

# ================= PERMISSIONS =================

class IsTeacher(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, 'userprofile') and request.user.userprofile.role == 'teacher'


class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, 'userprofile') and request.user.userprofile.role == 'student'


class IsTeacherOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        return request.user.is_authenticated and hasattr(request.user, 'userprofile') and request.user.userprofile.role == 'teacher'


# ================= STUDENT & TEACHER =================

class StudentView(generics.ListCreateAPIView):
    serializer_class = StudentSerializer
    permission_classes = [IsTeacher]

    def get_queryset(self):
        queryset = Student.objects.all()
        
        # Search by name
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                models.Q(first_name__icontains=search) | 
                models.Q(last_name__icontains=search) |
                models.Q(user__username__icontains=search)
            )
        
        # Filter by grade level (student_class)
        grade = self.request.query_params.get('grade', None)
        if grade:
            queryset = queryset.filter(student_class__name__icontains=grade)
        
        # Filter by subject
        subject = self.request.query_params.get('subject', None)
        if subject:
            queryset = queryset.filter(student_class__subject__name__icontains=subject)
        
        return queryset


class StudentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = StudentSerializer
    permission_classes = [IsTeacher]
    queryset = Student.objects.all()


class TeacherView(generics.ListCreateAPIView):
    serializer_class = TeacherSerializer
    permission_classes = [IsTeacherOrReadOnly]

    def get_queryset(self):
        return Teacher.objects.all()


# ================= CLASS =================

class ClassView(generics.ListCreateAPIView):
    serializer_class = ClassSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.userprofile.role == 'teacher':
            return Class.objects.filter(teacher__user=self.request.user)
        return Class.objects.all()


# ================= SUBJECT & EXAM =================

class SubjectView(generics.ListCreateAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsTeacher]


class ExamView(generics.ListCreateAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    permission_classes = [IsTeacher]


# ================= RESULTS =================

class ResultView(generics.ListCreateAPIView):
    serializer_class = ResultSerializer
    permission_classes = [IsTeacher]

    def get_queryset(self):
        return Result.objects.all()


class ExamResultsView(generics.ListAPIView):
    serializer_class = ResultSerializer
    permission_classes = [IsTeacher]

    def get_queryset(self):
        exam_id = self.request.query_params.get('exam_id')
        if exam_id:
            return Result.objects.filter(exam_id=exam_id)
        return Result.objects.none()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        data = serializer.data
        
        # Calculate class average
        if queryset.exists():
            percentages = [result.percentage for result in queryset]
            average_percentage = sum(percentages) / len(percentages) if percentages else 0
        else:
            average_percentage = 0
        
        response_data = {
            'results': data,
            'class_average_percentage': round(average_percentage, 2)
        }
        return Response(response_data)


# ================= ATTENDANCE =================

class AttendanceView(generics.ListCreateAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = [IsTeacher]

    def get_queryset(self):
        return Attendance.objects.all().order_by('-date')


class ClassAttendanceView(generics.ListAPIView):
    serializer_class = StudentSerializer
    permission_classes = [IsTeacher]

    def get_queryset(self):
        class_id = self.request.query_params.get('class_id')
        if class_id:
            return Student.objects.filter(student_class_id=class_id)
        return Student.objects.none()


# ================= FEES =================

class FeeView(generics.ListCreateAPIView):
    serializer_class = FeeSerializer
    permission_classes = [IsTeacher]

    def get_queryset(self):
        return Fee.objects.all().order_by('-due_date')


# ================= AUTH =================

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        try:
            data = JSONParser().parse(request)

            user = User.objects.create_user(
                username=data['username'],
                password=data['password']
            )

            # Create profile
            UserProfile.objects.create(
                user=user,
                role=data.get('role', 'student')
            )

            token = Token.objects.create(user=user)

            return JsonResponse({
                'token': str(token),
                'role': data.get('role', 'student')
            }, status=201)

        except IntegrityError:
            return JsonResponse({'error': 'Username exists'}, status=400)


@csrf_exempt
def login(request):
    if request.method == 'POST':
        try:
            # Handle both JSON and form data
            if request.content_type == 'application/json':
                data = json.loads(request.body) if request.body else {}
            else:
                data = request.POST.dict()
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")
            print(f"Request body: {request.body}")
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        username = data.get('username')
        password = data.get('password')

        print(f"Login attempt - Username: {username}, Password exists: {bool(password)}")

        if not username or not password:
            return JsonResponse({'error': 'Username and password required'}, status=400)

        user = authenticate(
            request,
            username=username,
            password=password
        )

        print(f"Authentication result: {user}")

        if user is None:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)

        token, _ = Token.objects.get_or_create(user=user)

        profile, created = UserProfile.objects.get_or_create(
            user=user,
            defaults={'role': 'teacher' if user.is_superuser else 'student'}
        )

        return JsonResponse({
            'token': str(token),
            'role': profile.role,
            'username': user.username
        }, status=200)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)


# ================= STUDENT PERSONAL DATA =================

class StudentProfileView(generics.RetrieveAPIView):
    serializer_class = StudentSerializer
    permission_classes = [IsStudent]

    def get_object(self):
        try:
            return Student.objects.get(user=self.request.user)
        except Student.DoesNotExist:
            # Return None if no Student record exists for this user
            return None


class StudentAttendanceView(generics.ListAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = [IsStudent]

    def get_queryset(self):
        try:
            student = Student.objects.get(user=self.request.user)
            return Attendance.objects.filter(student=student)
        except Student.DoesNotExist:
            # Return empty queryset if no Student record exists for this user
            return Attendance.objects.none()


class StudentResultsView(generics.ListAPIView):
    serializer_class = ResultSerializer
    permission_classes = [IsStudent]

    def get_queryset(self):
        try:
            student = Student.objects.get(user=self.request.user)
            return Result.objects.filter(student=student.user)
        except Student.DoesNotExist:
            # Return empty queryset if no Student record exists for this user
            return Result.objects.none()


class FeesView(generics.ListAPIView):
    serializer_class = FeeSerializer
    permission_classes = [IsStudent]

    def get_queryset(self):
        try:
            student = Student.objects.get(user=self.request.user)
            return Fee.objects.filter(student=student)
        except Student.DoesNotExist:
            # Return empty queryset if no Student record exists for this user
            return Fee.objects.none()


# ================= MESSAGING =================

class UsersView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Exclude the current user from the list
        return User.objects.exclude(id=self.request.user.id)


class MessageView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return (Message.objects.filter(sender=user) | Message.objects.filter(receiver=user)).distinct()

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


# ================= USER ROLE =================

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def user_profile(request):
    if hasattr(request.user, 'userprofile'):
        return Response({'role': request.user.userprofile.role})
    return Response({'role': 'unknown'})






class NotificationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        unread_messages = Message.objects.filter(
            receiver=request.user,
            is_read=False
        )

        return Response({
            "count": unread_messages.count(),
            "messages": MessageSerializer(unread_messages, many=True).data
        })    


class MarkAsReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Message.objects.filter(
            receiver=request.user,
            is_read=False
        ).update(is_read=True)

        return Response({"status": "marked as read"})        





def send_message(request):
    # save message logic...

    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        "notifications",
        {
            "type": "send_notification",
            "message": "New message received"
        }
    )        



def my_view(request):
    try:
        # your logic
        return JsonResponse({"ok": True})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)    