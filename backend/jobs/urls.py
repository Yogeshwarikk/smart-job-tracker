from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'applications', views.JobApplicationViewSet, basename='jobapplication')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', views.dashboard_stats, name='dashboard'),
    path('resume-feedback/', views.resume_feedback, name='resume-feedback'),
    path('interview-questions/', views.interview_questions, name='interview-questions'),
]
