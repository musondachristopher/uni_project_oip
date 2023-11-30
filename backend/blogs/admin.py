from django.contrib import admin
from .models import Blog, Comment

# Register your models here.
class CommentInline(admin.StackedInline):
	extra = 0
	model = Comment

@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
  list_display = ['title', 'author', 'approved', 'created']
  list_filter = ['approved', 'created']
  search_fields = ['title', 'author']
  list_editable = ['approved']
  list_select_related = True

  inlines = [CommentInline]

  