from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True
    dependencies = [migrations.swappable_dependency(settings.AUTH_USER_MODEL)]
    operations = [
        migrations.CreateModel(
            name="JobApplication",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("company", models.CharField(max_length=120)),
                ("job_title", models.CharField(max_length=120)),
                ("job_url", models.URLField(blank=True)),
                ("location", models.CharField(blank=True, max_length=120)),
                ("status", models.CharField(choices=[("saved", "Saved"), ("applied", "Applied"), ("screening", "Screening"), ("interview", "Interview"), ("offer", "Offer"), ("rejected", "Rejected"), ("withdrawn", "Withdrawn")], db_index=True, default="saved", max_length=20)),
                ("applied_date", models.DateField(blank=True, null=True)),
                ("interview_date", models.DateField(blank=True, null=True)),
                ("follow_up_date", models.DateField(blank=True, db_index=True, null=True)),
                ("resume", models.FileField(blank=True, upload_to="resumes/%Y/%m/")),
                ("notes", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="job_applications", to=settings.AUTH_USER_MODEL)),
            ],
            options={"ordering": ["-updated_at"], "indexes": [models.Index(fields=["user", "status"], name="applications_user_id_8c9f7b_idx"), models.Index(fields=["user", "follow_up_date"], name="applications_user_id_8a3db6_idx")]},
        ),
    ]
