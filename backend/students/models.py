from django.db import models
from django.contrib.auth.models import User
from django.db.models import Count, Q
class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    date_of_birth = models.DateField()
    student_class= models.ForeignKey('classes.Class', on_delete=models.CASCADE)
    enrollment_date = models.DateField()

    def get_attendance_percentage(self):
        from attendance.models import Attendance
        attendances = Attendance.objects.filter(student=self.user, class_obj=self.student_class)
        if not attendances.exists():
            return 0
        
        total_sessions = attendances.values('date').distinct().count()
        if total_sessions == 0:
            return 0
        
        present_count = attendances.filter(status='Present').count()
        late_count = attendances.filter(status='Late').count()
        
        # Present = 1 point, Late = 0.5 points, Absent = 0
        total_points = present_count * 1 + late_count * 0.5
        percentage = (total_points / total_sessions) * 100
        return round(percentage, 2)

    @property
    def attendance_percentage(self):
        return self.get_attendance_percentage()

    @property
    def attendance_flag(self):
        return self.attendance_percentage < 70

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

