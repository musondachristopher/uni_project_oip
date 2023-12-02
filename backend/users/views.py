from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from blogs.serializers import Blog, BlogSerializer, Course
from blogs.views import IsCreatorOrAdminOrReadOnly, CustomDefaultPagination
from rest_framework.response import Response

class MyBlogs(ModelViewSet):
	queryset = Blog.objects.all()
	serializer_class = BlogSerializer
	permission_classes = [IsCreatorOrAdminOrReadOnly]
	pagination_class = CustomDefaultPagination

	def get_queryset(self):
		user = self.request.user
		return Blog.objects.filter(author__id=user.id)

	def create(self, request):
		serializer = self.serializer_class(data=request.data)

		try:
			obj = request.data.get('course', None)
			course = Course.objects.get(code=obj['code'])

		except Course.DoesNotExist:
			return Response(status=404)

		if serializer.is_valid():
			serializer.save(author=request.user, course=course)
			return Response(serializer.data, status=201)
		return Response(serializer.errors, status=400)


	def update(self, request, pk):
		try:
			obj = request.data.get('course', None)
			course = Course.objects.get(code=obj['code'])

		except Course.DoesNotExist:
			return Response(status=404)

		serializer = self.serializer_class(self.get_object(), data=request.data)

		if serializer.is_valid():
			serializer.save(course=course)
			return Response(serializer.data, status=200)

		return Response(serializer.errors, status=400)	