from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
class Attendance(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    class_obj= models.ForeignKey('classes.Class', on_delete=models.CASCADE)
    date= models.DateField()
    STATUS_CHOICE= [
        ('Present', 'Present'),
        ('Absent', 'Absent'),
        ('Late', 'Late'),
    ]
    status= models.CharField(max_length=10, choices=STATUS_CHOICE)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Attendance for {self.student} in {self.class_obj} on {self.date} - Status: {self.status}"  
