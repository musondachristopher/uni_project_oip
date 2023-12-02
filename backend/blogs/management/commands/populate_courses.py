from blogs.models import Course
from .courses import courses
from django.core.management.base import BaseCommand, CommandError



class Command(BaseCommand):
	help = "Command to add courses to database"
	
	def handle(self, *args, **options):
		for course in courses:
			try:
				course = Course.objects.get_or_create(code=course["code"], name=course["name"])
				print(course)

			except Exception as e:
				raise CommandError(e)

