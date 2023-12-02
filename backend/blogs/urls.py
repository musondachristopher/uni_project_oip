from django.urls import path
from .views import BlogViewSet, CommentViewSet, CourseViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'blogs', BlogViewSet)
# router.register(r)


urlpatterns = [
  *router.urls,
  # path('popular', BlogViewSet.as_view({'get': 'popular'}), name='popular-blogs'),
  # path('<int:blog_id>/approval', BlogViewSet.as_view({'get': 'approval'}), name="blog-approval"),
  path('blogs/<int:blog_id>/comments/', CommentViewSet.as_view({'get': 'list', 'post': 'create'}), name='blog-comments'),
  path('courses/', CourseViewSet.as_view(), name="courses"),
]