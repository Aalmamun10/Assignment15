from django.contrib import admin
from .models import JobApplication
@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ("company", "job_title", "status", "user", "follow_up_date", "updated_at")
    list_filter = ("status",)
    search_fields = ("company", "job_title", "user__username")
