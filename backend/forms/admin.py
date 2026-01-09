from django.contrib import admin
from .models import Form, FormField

class FormFieldInline(admin.TabularInline):
    model = FormField
    extra = 1

@admin.register(Form)
class FormAdmin(admin.ModelAdmin):
    inlines = [FormFieldInline]
