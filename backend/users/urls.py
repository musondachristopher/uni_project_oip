from .views import MyBlogs
from django.urls import path
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'me/blogs', MyBlogs)

urlpatterns = [
	*router.urls
]