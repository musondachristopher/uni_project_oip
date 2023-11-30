from rest_framework.serializers import ModelSerializer, SerializerMethodField
from .models import *
from users.models import User


class AuthorSerializer(ModelSerializer):
	full_name = SerializerMethodField()

	class Meta:
		model = User
		fields = ['id', 'full_name', 'email']

	def get_full_name(self, obj):
		return obj.get_full_name().title()


class CommentSerializer(ModelSerializer):
	class Meta:
		model = Comment
		exclude = ['disabled',]
		read_only_fields = ['blog']

    	
class BlogSerializer(ModelSerializer):
	author = AuthorSerializer(read_only=True)

	class Meta:
		model = Blog
		fields = '__all__'
