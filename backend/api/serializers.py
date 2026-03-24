from rest_framework import serializers

from attendance.models import Attendance
from fees.models import Fee
from classes.models import Class
from exams.models import Exam
from results.models import Result
from students.models import student
from subjects.models import Subject
from teachers.models import Teacher


class TeacherSerializer(serializers.ModelSerializer):
    hire_date= serializers.ReadOnlyField()
    class Meta:
        model = Teacher
        fields = ['id', 'user', 'first_name', 'last_name', 'email', 'hire_date']


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = student
        fields = ['id', 'user', 'first_name', 'last_name', 'email', 'date_of_birth', 'student_class', 'enrollment_date']


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

