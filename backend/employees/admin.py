from django.contrib import admin
from .models import Employee, EmployeeData

class EmployeeDataInline(admin.TabularInline):
    model = EmployeeData
    extra = 1

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    inlines = [EmployeeDataInline]
