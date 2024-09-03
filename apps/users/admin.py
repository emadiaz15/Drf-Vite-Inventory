from django.contrib import admin
from .models import User

class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'name', 'last_name', 'is_staff')
    search_fields = ('username', 'email', 'name', 'last_name')
    list_filter = ('is_staff', 'is_active')

admin.site.register(User, UserAdmin)
