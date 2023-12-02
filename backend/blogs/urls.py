from django.urls import path
from .views import BlogViewSet, CommentViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'', BlogViewSet)

urlpatterns = [
  *router.urls,
  path('<int:blog_id>/approval', BlogViewSet.as_view({'get': 'approval'}), name="blog-approval"),
  path('<int:blog_id>/comments/', CommentViewSet.as_view({'get': 'list', 'post': 'create'}), name='blog-comments'),
]