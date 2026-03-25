from django.db import models

class Class(models.Model):
    name = models.CharField(max_length=100, blank=False)
    teacher = models.ForeignKey('teachers.Teacher', on_delete=models.CASCADE)
    subject = models.ForeignKey('subjects.Subject', on_delete=models.CASCADE)


    def __str__(self):
        return f"{self.teacher} {self.subject}"

