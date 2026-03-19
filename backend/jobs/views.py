import random
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import JobApplication
from .serializers import JobApplicationSerializer


class JobApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return JobApplication.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    apps = JobApplication.objects.filter(user=request.user)
    stats = {
        'total': apps.count(),
        'applied': apps.filter(status='applied').count(),
        'interview': apps.filter(status='interview').count(),
        'offer': apps.filter(status='offer').count(),
        'rejected': apps.filter(status='rejected').count(),
        'selected': apps.filter(status='selected').count(),
        'withdrawn': apps.filter(status='withdrawn').count(),
    }
    # Recent activity (last 5)
    recent = apps[:5]
    stats['recent'] = JobApplicationSerializer(recent, many=True).data
    return Response(stats)


# ── Mock AI Logic ──────────────────────────────────────────────────────────────

RESUME_TIPS = [
    {
        "category": "Impact",
        "score": None,  # filled dynamically
        "feedback": "Quantify achievements with numbers. Instead of 'improved performance', say 'improved performance by 40%'.",
        "severity": "high",
    },
    {
        "category": "Keywords",
        "score": None,
        "feedback": "Add industry-specific keywords matching the job description to pass ATS filters.",
        "severity": "medium",
    },
    {
        "category": "Formatting",
        "score": None,
        "feedback": "Use consistent date formats and bullet points. Keep to 1–2 pages max.",
        "severity": "low",
    },
    {
        "category": "Action Verbs",
        "score": None,
        "feedback": "Start bullet points with strong action verbs: Led, Built, Designed, Optimized, Delivered.",
        "severity": "medium",
    },
    {
        "category": "Summary",
        "score": None,
        "feedback": "Add a 2–3 line professional summary at the top tailored to the target role.",
        "severity": "high",
    },
]

QUESTION_BANK = {
    "default": [
        "Tell me about yourself and your background.",
        "Why are you interested in this position?",
        "Where do you see yourself in 5 years?",
        "What is your greatest strength and weakness?",
        "Describe a challenge you faced and how you overcame it.",
        "Why are you leaving your current job?",
        "What motivates you?",
        "How do you handle pressure or tight deadlines?",
    ],
    "software": [
        "Explain the difference between REST and GraphQL.",
        "What is your approach to debugging a production issue?",
        "How do you ensure code quality in your projects?",
        "Describe your experience with Agile/Scrum methodology.",
        "Walk me through a system you designed from scratch.",
        "How do you stay updated with new technologies?",
        "What is your experience with CI/CD pipelines?",
        "Explain a complex technical concept to a non-technical person.",
    ],
    "data": [
        "Explain the difference between supervised and unsupervised learning.",
        "How do you handle missing data in a dataset?",
        "Describe a data pipeline you have built.",
        "What metrics do you use to evaluate a machine learning model?",
        "How do you communicate data insights to stakeholders?",
        "What is the curse of dimensionality?",
        "Explain overfitting and how to prevent it.",
        "Walk me through your data cleaning process.",
    ],
    "marketing": [
        "Describe a successful campaign you ran end-to-end.",
        "How do you measure ROI on a marketing campaign?",
        "What tools do you use for SEO and analytics?",
        "How do you identify and target your audience?",
        "Describe your content strategy experience.",
        "How do you stay current with digital marketing trends?",
        "Tell me about a campaign that failed and what you learned.",
        "How do you balance creativity with data-driven decisions?",
    ],
    "design": [
        "Walk me through your design process.",
        "How do you handle design feedback and criticism?",
        "Describe how you balance user needs with business goals.",
        "What tools do you use for design and prototyping?",
        "Tell me about a time you advocated for the user.",
        "How do you approach accessibility in your designs?",
        "Describe a project where constraints fueled your creativity.",
        "How do you present design decisions to stakeholders?",
    ],
    "finance": [
        "Explain DCF analysis and when you would use it.",
        "How do you build and validate a financial model?",
        "Describe a time you identified a financial risk.",
        "What is your experience with budgeting and forecasting?",
        "How do you explain complex financial data to non-finance teams?",
        "What financial software/tools are you proficient in?",
        "Describe your experience with variance analysis.",
        "How do you prioritize competing financial projects?",
    ],
}


def _get_category(role: str) -> str:
    role_lower = role.lower()
    if any(k in role_lower for k in ['software', 'engineer', 'developer', 'backend', 'frontend', 'fullstack', 'devops']):
        return 'software'
    if any(k in role_lower for k in ['data', 'analyst', 'scientist', 'ml', 'machine learning', 'ai']):
        return 'data'
    if any(k in role_lower for k in ['marketing', 'growth', 'seo', 'content', 'brand']):
        return 'marketing'
    if any(k in role_lower for k in ['design', 'ux', 'ui', 'product design', 'visual']):
        return 'design'
    if any(k in role_lower for k in ['finance', 'accounting', 'financial', 'analyst']):
        return 'finance'
    return 'default'


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def resume_feedback(request):
    """Mock AI resume feedback based on resume text."""
    resume_text = request.data.get('resume_text', '')
    role = request.data.get('role', 'General')

    if len(resume_text) < 50:
        return Response({'error': 'Please provide a more detailed resume text.'}, status=400)

    word_count = len(resume_text.split())
    # Simulate scoring
    tips = []
    overall_score = 0
    for tip in RESUME_TIPS:
        score = random.randint(50, 95)
        overall_score += score
        tips.append({**tip, 'score': score})

    overall_score = round(overall_score / len(RESUME_TIPS))

    return Response({
        'overall_score': overall_score,
        'word_count': word_count,
        'role_analyzed': role,
        'tips': tips,
        'summary': (
            f"Your resume scored {overall_score}/100. "
            "Focus on quantifying achievements and adding relevant keywords to improve your chances."
        ),
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def interview_questions(request):
    """Generate mock interview questions based on role."""
    role = request.data.get('role', '')
    if not role:
        return Response({'error': 'Please provide a job role.'}, status=400)

    category = _get_category(role)
    role_questions = QUESTION_BANK.get(category, [])
    general_questions = QUESTION_BANK['default']

    # Mix: 4 role-specific + 4 general
    selected = random.sample(role_questions, min(4, len(role_questions))) + \
               random.sample(general_questions, min(4, len(general_questions)))
    random.shuffle(selected)

    return Response({
        'role': role,
        'category': category,
        'questions': [{'id': i + 1, 'question': q} for i, q in enumerate(selected)],
        'tip': "Practice the STAR method: Situation, Task, Action, Result.",
    })
