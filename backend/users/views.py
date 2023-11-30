from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from blogs.serializers import Blog, BlogSerializer
from blogs.views import IsCreatorOrAdminOrReadOnly
from rest_framework.response import Response

class MyBlogs(ModelViewSet):
  queryset = Blog.objects.all()
  serializer_class = BlogSerializer
  permission_classes = [IsCreatorOrAdminOrReadOnly]

  def list(self, request):
    q = self.queryset.filter(author__id = request.user.id)
    blogs = BlogSerializer(q, many=True)
    return Response(blogs.data)