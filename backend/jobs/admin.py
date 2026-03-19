from django.contrib import admin
from .models import JobApplication


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('company', 'role', 'status', 'date_applied', 'user')
    list_filter = ('status', 'date_applied')
    search_fields = ('company', 'role', 'user__username')
    ordering = ('-date_applied',)
