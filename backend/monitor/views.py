from rest_framework import generics
from .models import LoginAttempt
from .serializers import LoginAttemptSerializer

class LoginAttemptList(generics.ListAPIView):
    # Traemos todos los intentos, ordenados del más reciente al más antiguo
    queryset = LoginAttempt.objects.all().order_by('-timestamp')
    serializer_class = LoginAttemptSerializer