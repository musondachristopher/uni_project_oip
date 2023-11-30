from django.db import models
from django.contrib.auth.models import AbstractUser
 
# Create your models here.

class User(AbstractUser):
  username = None
  student_id=models.PositiveSmallIntegerField(unique=True)
  email = models.EmailField(unique=True)

  USERNAME_FIELD = "email"
  REQUIRED_FIELDS = ["first_name", "last_name", "student_id"]
  
  def __str__(self):
    return f'{self.get_full_name() or self.email}'