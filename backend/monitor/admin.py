from django.contrib import admin
from .models import LoginAttempt

@admin.register(LoginAttempt)
class LoginAttemptAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'username_attempted', 'ip_address', 'country', 'was_successful')
    list_filter = ('was_successful', 'country')
    search_fields = ('ip_address', 'username_attempted')
    readonly_fields = ('timestamp',) # Para que nadie pueda manipular la hora del evento