from rest_framework import serializers
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
from django.contrib.auth.models import User


class TeacherSerializer(serializers.ModelSerializer):
    hire_date = serializers.ReadOnlyField()
    email = serializers.EmailField(required=True)
    
    class Meta:
        model = Teacher
        fields = ['id', 'user', 'first_name', 'last_name', 'email', 'hire_date']
        
    def validate_email(self, value):
        if Teacher.objects.filter(email=value).exists():
            raise serializers.ValidationError("A teacher with this email already exists.")
        return value


class StudentSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    date_of_birth = serializers.DateField(required=True)
    enrollment_date = serializers.DateField(required=True)
    
    class Meta:
        model = Student
        fields = ['id', 'user', 'first_name', 'last_name', 'email', 'date_of_birth', 'student_class', 'enrollment_date']
        
    def validate_email(self, value):
        if Student.objects.filter(email=value).exists():
            raise serializers.ValidationError("A student with this email already exists.")
        return value


class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ['id', 'name', 'teacher', 'subject']

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name', 'description']
       

class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ['id', 'subject', 'date', 'duration', 'total_marks']


class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = ['id', 'student', 'exam', 'marks_obtained']


class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = ['id', 'student', 'class_obj', 'date', 'status']


class FeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fee
        fields = ['id', 'student', 'amount', 'due_date', 'status']        


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'role']

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    role = serializers.CharField(read_only=True)
    user_id = serializers.IntegerField(read_only=True)



class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'