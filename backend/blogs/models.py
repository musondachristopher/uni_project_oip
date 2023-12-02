from django.db import models
from django.conf import settings
from django.db.models.query import QuerySet
from django.utils.text import slugify

# Create your models here.
class TimeStamped(models.Model):
	created = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)

	class Meta:
		abstract = True
		ordering = ('-created', )	


class Course(models.Model):
	code = models.CharField(max_length=8, unique=True)
	name = models.CharField(max_length=100)

	class Meta: 
		ordering = ("code", "name")
		indexes = [ models.Index(fields=["code"]), ]

	def save(self, *args, **kwargs):
		self.code = slugify(self.code)
		super().save(*args, **kwargs)

	def __str__(self):
		return f"{(self.code[:3] + ' ' + self.code[3:]).upper()} - {self.name.title()} "


class ApprovedBlogs(models.Manager):
	def get_queryset(self) -> QuerySet:
		return super().get_queryset().filter(approved=True)

class Blog(TimeStamped):
	title  = models.CharField(max_length=255)
	body	 = models.TextField()
	rating = models.PositiveSmallIntegerField(default=0)
	author = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="blogs", on_delete=models.CASCADE)
	course = models.ForeignKey(Course, related_name="blogs", on_delete=models.CASCADE)
	approved = models.BooleanField(default=False)
	objects = models.Manager()
	is_approved = ApprovedBlogs()

	def __str__(self):
		return f'{self.title} by {self.author.get_full_name()}'
	
		class Meta(TimeStamped.Meta):
			index_together = [['author', 'id'], ['course', 'id']]


class Comment(TimeStamped):
	full_name = models.CharField(max_length=255)
	email  = models.EmailField()
	website = models.URLField(null=True, blank=True)
	comment = models.TextField(max_length=500)
	disabled = models.BooleanField(default=False)
	blog = models.ForeignKey(Blog, related_name="comments", on_delete=models.CASCADE)

	def __str__(self):
		return f'comment by {self.email}'