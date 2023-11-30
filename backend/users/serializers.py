from rest_framework.serializers import (
  ModelSerializer, SerializerMethodField, 
	Serializer, CharField, IntegerField
)
from dj_rest_auth.registration.serializers import RegisterSerializer
from django.contrib.auth import authenticate
from .models import User


class UserDetailsSerializer(ModelSerializer):
	full_name = SerializerMethodField(read_only=True)	
	
	class Meta:
		model=User
		exclude=['password', 'is_superuser', 'is_active', 'groups', 'last_login', 'user_permissions']
		read_only_fields = ['date_joined', 'is_staff']

	def get_full_name(self, obj):
		return obj.get_full_name().title()


class UserRegistrationSerializer(RegisterSerializer):
	first_name = CharField(max_length=50)
	last_name = CharField(max_length=50)

	def get_cleaned_data(self):
		super().get_cleaned_data()
		
		return {
				'username': self.validated_data.get('username', ''),
				'password1': self.validated_data.get('password1', ''),
				'password2': self.validated_data.get('password2', ''),
				'email': self.validated_data.get('email', ''),
				'first_name': self.validated_data.get('first_name', ''),
				'last_name': self.validated_data.get('last_name', '')
		}
