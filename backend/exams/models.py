from django.db import models

class Exam(models.Model):
    subject= models.ForeignKey('subjects.Subject', on_delete=models.CASCADE)
    date= models.DateField()
    duration= models.DurationField()
    total_marks= models.IntegerField()


    def __str__(self):
        return f"{self.subject} {self.date}"

