from rest_framework import serializers
from .models import LoginAttempt

class LoginAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoginAttempt
        fields = ['id', 'timestamp', 'username_attempted', 'ip_address', 'country', 'city', 'lat', 'lon', 'was_successful']