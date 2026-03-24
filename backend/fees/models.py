from django.db import models
from django.contrib.auth.models import User

class Fee(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    STATUS_CHOICE = [
        ('Paid', 'Paid'),
        ('Unpaid', 'Unpaid'),
    ]
    status = models.BooleanField(max_length=10, choices=STATUS_CHOICE, default='Unpaid')

    def __str__(self):
        return f"Fee for {self.student} - Amount: {self.amount} - Status: {self.status}"

