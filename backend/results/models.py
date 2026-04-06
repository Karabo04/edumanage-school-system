from django.db import models
from django.contrib.auth.models import User
class Result(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    exam = models.ForeignKey('exams.Exam', on_delete=models.CASCADE)
    marks_obtained = models.IntegerField()
    created = models.DateTimeField(auto_now_add=True)

    @property
    def percentage(self):
        if self.exam.total_marks > 0:
            return (self.marks_obtained / self.exam.total_marks) * 100
        return 0

    @property
    def grade(self):
        pct = self.percentage
        if pct >= 80:
            return "Distinction"
        elif pct >= 70:
            return "Merit"
        elif pct >= 60:
            return "Pass"
        elif pct >= 50:
            return "Symbol E"
        else:
            return "Fail"

    def __str__(self):
        return f"Result for {self.student} in {self.exam} - Marks: {self.marks_obtained}"

