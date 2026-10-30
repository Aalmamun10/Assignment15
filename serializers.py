from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import JobApplication

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, style={"input_type": "password"})

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class JobApplicationSerializer(serializers.ModelSerializer):
    resume_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = JobApplication
        fields = [
            "id", "company", "job_title", "job_url", "location", "status",
            "applied_date", "interview_date", "follow_up_date", "resume",
            "resume_url", "notes", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "resume_url"]

    def get_resume_url(self, obj):
        request = self.context.get("request")
        if obj.resume and request:
            return request.build_absolute_uri(obj.resume.url)
        return None

    def validate_resume(self, value):
        if value:
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("Resume must be 5 MB or smaller.")
            allowed = {".pdf", ".doc", ".docx"}
            import os
            if os.path.splitext(value.name)[1].lower() not in allowed:
                raise serializers.ValidationError("Only PDF, DOC, or DOCX files are allowed.")
        return value
