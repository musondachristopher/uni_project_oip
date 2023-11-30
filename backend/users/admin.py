from django.contrib import admin
from .models import User


# Register your models here.
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
  list_display = ["email", 'student_id', 'is_superuser', 'is_staff', 'is_active', 'date_joined']  
  list_filter = ['date_joined', 'is_superuser', 'is_staff', 'is_active']
  search_fields = ['email', 'student_id',]
  ordering = ['-date_joined', 'email']

  
  def get_full(self, obj):
    return obj.get_full_name