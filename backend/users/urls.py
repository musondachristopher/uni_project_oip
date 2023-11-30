from .views import MyBlogs
from django.urls import path


urlpatterns = [
  path('me/blogs', MyBlogs.as_view({ 'get': 'list' })),
]