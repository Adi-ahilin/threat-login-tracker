from django.db import models

class LoginAttempt(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    username_attempted = models.CharField(max_length=255)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    was_successful = models.BooleanField(default=False)
    user_agent = models.TextField(null=True, blank=True)
    
    # Datos de Geolocalización (Para el mapa de amenazas)
    country = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    lat = models.FloatField(null=True, blank=True)
    lon = models.FloatField(null=True, blank=True)

    def __str__(self):
        status = "EXITO" if self.was_successful else "FALLO"
        return f"{self.timestamp} - {status} - {self.username_attempted} ({self.ip_address})"