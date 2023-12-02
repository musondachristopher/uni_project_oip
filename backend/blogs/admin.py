from django.contrib import admin
from .models import Blog, Comment, Course

# Register your models here.
class CommentInline(admin.StackedInline):
	extra = 0
	model = Comment

@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
  list_display = ['title', 'author', 'approved', 'created']
  list_filter = ['approved', 'created']
  search_fields = ['title', 'author__first_name', "author__last_name", "author__email"]
  list_editable = ['approved']
  list_select_related = True

  inlines = [CommentInline]

  
@admin.register(Course)
class Course(admin.ModelAdmin):
	list_display = ['code', 'name']
	search_fields = ['code', 'name']
	list_editable = ['name']