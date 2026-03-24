from django.db import models
from django.contrib.auth.models import User
class Result(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    exam = models.ForeignKey('exams.Exam', on_delete=models.CASCADE)
    marks_obtained = models.IntegerField()


    def __str__(self):
        return f"Result for {self.student} in {self.exam} - Marks: {self.marks_obtained}"

