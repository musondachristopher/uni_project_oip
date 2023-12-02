# Generated by Django 4.2.7 on 2023-12-01 13:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('blogs', '0004_course_alter_blog_rating'),
    ]

    operations = [
        migrations.AddField(
            model_name='blog',
            name='course',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='blogs', to='blogs.course'),
            preserve_default=False,
        ),
    ]