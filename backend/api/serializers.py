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
    attendance_percentage = serializers.ReadOnlyField()
    attendance_flag = serializers.ReadOnlyField()
    grade = serializers.CharField(source='student_class.name', read_only=True)
    subject = serializers.CharField(source='student_class.subject.name', read_only=True)
    marks = serializers.SerializerMethodField()
    
    class Meta:
        model = Student
        fields = ['id', 'first_name', 'last_name', 'email', 'date_of_birth', 'student_class', 'enrollment_date', 'attendance_percentage', 'attendance_flag', 'grade', 'subject', 'marks']
        read_only_fields = ['user', 'attendance_percentage', 'attendance_flag', 'grade', 'subject', 'marks']        
    def get_marks(self, obj):
        from results.models import Result
        results = Result.objects.filter(student=obj.user).select_related('exam__subject')
        marks_data = []
        for result in results:
            marks_data.append({
                'subject': result.exam.subject.name,
                'exam': result.exam.date.strftime('%Y-%m-%d'),
                'marks_obtained': result.marks_obtained,
                'total_marks': result.exam.total_marks,
                'percentage': result.percentage,
                'grade': result.grade
            })
        return marks_data
        
    def create(self, validated_data):
        try:
            # Create the User first
            user_data = {
                'username': validated_data['email'],  # Use email as username
                'email': validated_data['email'],
                'first_name': validated_data['first_name'],
                'last_name': validated_data['last_name'],
                'password': 'defaultpassword123'  # Default password - should be changed later
            }
            user = User.objects.create_user(**user_data)
            
            # Create UserProfile
            UserProfile.objects.create(user=user, role='student')
            
            # Create Student
            student = Student.objects.create(
                user=user,
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name'],
                email=validated_data['email'],
                date_of_birth=validated_data['date_of_birth'],
                student_class=validated_data['student_class'],
                enrollment_date=validated_data['enrollment_date']
            )
            return student
        except Exception as e:
            print(f"Error creating student: {e}")
            raise
        
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
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
    percentage = serializers.ReadOnlyField()
    grade = serializers.ReadOnlyField()
    
    class Meta:
        model = Result
        fields = ['id', 'student', 'exam', 'marks_obtained', 'percentage', 'grade']


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
    sender = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'content', 'timestamp', 'is_read']
        read_only_fields = ['id', 'sender', 'timestamp', 'is_read']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']
        read_only_fields = ['id']