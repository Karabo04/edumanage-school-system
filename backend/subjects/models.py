from django.db import models

class Subject(models.Model):
    name= models.CharField(max_length=10, blank=False)
    description= models.CharField(max_length=100, blank=False)



    def __str__(self):
        return f"{self.name} {self.description}"

