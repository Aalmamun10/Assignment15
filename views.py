from django.contrib.auth import get_user_model
from django.db.models import Count
from rest_framework import generics, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import JobApplication
from .serializers import RegisterSerializer, JobApplicationSerializer
from .permissions import IsOwner

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class JobApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        qs = JobApplication.objects.filter(user=self.request.user).select_related("user")
        status_value = self.request.query_params.get("status")
        search = self.request.query_params.get("search")
        if status_value:
            qs = qs.filter(status=status_value)
        if search:
            from django.db.models import Q
            qs = qs.filter(Q(company__icontains=search) | Q(job_title__icontains=search))
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class DashboardSummaryView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = JobApplication.objects.filter(user=request.user)
        counts = {item["status"]: item["total"] for item in qs.values("status").annotate(total=Count("id"))}
        return Response({
            "total": qs.count(),
            "interviews": qs.filter(status=JobApplication.Status.INTERVIEW).count(),
            "offers": qs.filter(status=JobApplication.Status.OFFER).count(),
            "follow_ups_due": qs.filter(follow_up_date__isnull=False).count(),
            "by_status": counts,
        })
