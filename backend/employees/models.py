from django.db import models
from forms.models import Form, FormField


class Employee(models.Model):
    form = models.ForeignKey(Form, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Employee {self.id}"


class EmployeeData(models.Model):
    employee = models.ForeignKey(
        Employee, related_name="data", on_delete=models.CASCADE
    )
    field = models.ForeignKey(FormField, on_delete=models.CASCADE)
    value = models.TextField()

    def __str__(self):
        return f"{self.field.label}: {self.value}"
