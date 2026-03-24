from pyclbr import Class
from rest_framework import generics, permissions
from django.shortcuts import render
from django.db import IntegrityError
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from rest_framework.parsers import JSONParser
from attendance.models import Attendance
from exams.models import Exam
from results.models import Result
from subjects.models import Subject
from teachers.models import Teacher
from classes.models import Class
from fees.models import Fee

from .serializers import AttendanceSerializer, ClassSerializer, ExamSerializer, ResultSerializer, StudentSerializer, SubjectSerializer, TeacherSerializer, FeeSerializer

class StudentView(generics.ListCreateAPIView):
    serializer_class = StudentSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        user= self.request.user
        return Result.objects.filter(user=user)

    

class TeacherView(generics.ListCreateAPIView):
    serializer_class = TeacherSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        user= self.request.user
        return Teacher.objects.filter(user=user)


class ClassView(generics.ListCreateAPIView):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    permission_classes = [permissions.IsAuthenticated]

class ExamView(generics.ListCreateAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    permission_classes = [permissions.IsAuthenticated]


class SubjectView(generics.ListCreateAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [permissions.IsAuthenticated]    


class ResultView(generics.ListCreateAPIView):
    serializer_class = ResultSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user= self.request.user
        return Result.objects.filter(user=user).order_by('-created')



class AttendanceView(generics.ListCreateAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        user= self.request.user
        return Attendance.objects.filter(user=user).order_by('-created')
    

class FeeView(generics.ListCreateAPIView):
    serializer_class = FeeSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        user= self.request.user
        return Fee.objects.filter(user=user).order_by('-created')
    
@csrf_exempt
def signup(request):
   if request.method == 'POST':
        try: 
           data= JSONParser().parse(request) # Data is dictionary
           user= User.objects.create_user(username=data['username'], password=data['password'])           
           user.save()
           token= Token.objects.create(user=user)
           return JsonResponse({'token': str(token)}, status=201)
        except IntegrityError:
            return JsonResponse({'error': 'Username already exists'}, status=400)

@csrf_exempt
def login(request):
    if request.method == 'POST':
        data= JSONParser().parse(request)
        user= authenticate(request, username=data['username'], password=data['password'])
        if user is None:
            return JsonResponse({'error': 'unable to login. check username and password'}, status=400)
        else:
            try:
                 token= Token.objects.get(user=user)
            except:
                token= Token.objects.create(user=user)
            return JsonResponse({'token': str(token)}, status=201)     

        

