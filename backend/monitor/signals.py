from django.contrib.auth.signals import user_login_failed
from django.dispatch import receiver
from .models import LoginAttempt
import requests

# Función para obtener la IP real
def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

# Función para obtener datos geo (País, Ciudad)
def get_geo_data(ip_address):
    # En localhost (127.0.0.1) la geolocalización no funciona, retornamos vacío
    if ip_address == '127.0.0.1' or ip_address.startswith('192.168'):
        return None
        
    try:
        # Usamos una API gratuita con timeout de 5 segundos para no colgar el sistema
        response = requests.get(f'http://ip-api.com/json/{ip_address}', timeout=5)
        data = response.json()
        if data.get('status') == 'success':
            return data
    except Exception as e:
        print(f"Error geo API: {e}")
    return None

@receiver(user_login_failed)
def log_failed_login(sender, credentials, request, **kwargs):
    # 1. Capturar IP
    ip = get_client_ip(request)
    print(f"⚠️  Intento fallido detectado desde: {ip}") # Esto saldrá en tu terminal
    
    # 2. Consultar GeoData
    geo_info = get_geo_data(ip)
    
    # 3. Guardar en Base de Datos
    attempt = LoginAttempt.objects.create(
        username_attempted=credentials.get('username', 'Unknown'),
        ip_address=ip,
        was_successful=False,
        user_agent=request.META.get('HTTP_USER_AGENT', '')
    )
    
    # 4. Si hay datos geográficos, los agregamos
    if geo_info:
        attempt.country = geo_info.get('country')
        attempt.city = geo_info.get('city')
        attempt.lat = geo_info.get('lat')
        attempt.lon = geo_info.get('lon')
        attempt.save()