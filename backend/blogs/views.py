from django.shortcuts import render
from .serializers import CommentSerializer, BlogSerializer, Blog, Comment, Course
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.permissions import BasePermission
from rest_framework import filters
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from django.db.models import Count


class CustomDefaultPagination(PageNumberPagination):

	page_size = 6
	page_size_query_param = 'size'
	max_page_size = 10
	page_query_param = 'page'

	def get_paginated_response(self, data):
		return Response({
	    'next': self.page.next_page_number() if self.page.has_next() else None,
	    'previous': self.page.previous_page_number() if self.page.has_previous() else None,
	    'count': self.page.paginator.count,
	    'results': data
		})

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
	pagination_class = CustomDefaultPagination
	filter_backends = [filters.SearchFilter]	
	search_fields = ["body", "title", "author__first_name", "author__last_name", "course__code", "course__name"]

	@action(detail=True, methods=['get'])
	def approval(self, request, pk):
		blog = self.get_object()

		blog.approved = not blog.approved
		blog.save()

		serializer = BlogSerializer(blog)
		return Response(serializer.data)

	@action(detail=False, methods=['get'])
	def popular(self, request):
		blogs = self.queryset.annotate(total_comments=Count("comments")).order_by("-total_comments")

		for blog in blogs:
			print(blog.total_comments)
		page = self.paginate_queryset(blogs)
		if page is not None:
			serializer = self.get_serializer(page, many=True)
			return self.get_paginated_response(serializer.data)

		serializer = self.serializer_class(blogs, many=True)
		return Response(serializer.data)


	@action(detail=True, methods=['get'])
	def similar(self, request, pk):
		obj = self.get_object()
		blogs = self.queryset.filter(course=obj.course).exclude(id=pk)

		page = self.paginate_queryset(blogs)
		if page is not None:
			serializer = self.serializer_class(blogs, many=True)
			return self.get_paginated_response(serializer.data)

		serializer = self.serializer_class(blogs, many=True)
		return Response(serializer.data, status=200)


class CommentViewSet(ModelViewSet):
	queryset = Comment.objects.filter(disabled=False)
	serializer_class = CommentSerializer

	def get_queryset(self):
		blog_id = self.kwargs['blog_id']
		return Comment.objects.filter(blog__id=blog_id)
  

