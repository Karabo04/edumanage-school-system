from django.db import models
from django.contrib.auth.models import User
class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    date_of_birth = models.DateField()
    student_class= models.ForeignKey('classes.Class', on_delete=models.CASCADE)
    enrollment_date = models.DateField()

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

