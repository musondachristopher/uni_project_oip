from django.shortcuts import render
from .serializers import CommentSerializer, BlogSerializer, Blog, Comment
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.permissions import BasePermission


class IsCreatorOrAdminOrReadOnly(BasePermission):
	def has_permission(self, request, view):
		# Allow read-only permissions for GET, HEAD, and OPTIONS requests
		if request.method in ['GET', 'HEAD', 'OPTIONS']:
			return True

		# Check if the user is authenticated
		if request.user and request.user.is_authenticated:
			# Allow creation of blog posts
			if view.action == 'create':
				return True

			# Allow update, retrieve, and destroy if the user is the creator or admin
			return True if view.get_object().author == request.user or request.user.is_staff else False
		return False


# Create your views here.
class BlogViewSet(ModelViewSet):
	queryset = Blog.is_approved.all()
	serializer_class = BlogSerializer
	permissions_classes = [IsCreatorOrAdminOrReadOnly]

	def create(self, request):
		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid():
			serializer.save(author=request.user)
			return Response(serializer.data, status=201)

		return Response(serializer.errors, status=400)


	def approval(self, request, blog_id):
		try:
			blog = Blog.objects.get(pk=blog_id)

		except Blog.DoesNotExist:
			return Response(status=404)

		blog.approved = not blog.approved
		blog.save()

		serializer = BlogSerializer(blog)
		return Response(serializer.data)


class CommentViewSet(ModelViewSet):
	queryset = Comment.objects.filter(disabled=False)
	serializer_class = CommentSerializer

	def get_queryset(self):
		blog_id = self.kwargs['blog_id']
		return Comment.objects.filter(blog__id=blog_id)
  

