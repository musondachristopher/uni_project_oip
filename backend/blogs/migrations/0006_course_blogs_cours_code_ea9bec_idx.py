# Generated by Django 4.2.7 on 2023-12-01 13:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blogs', '0005_blog_course'),
    ]

    operations = [
        migrations.AddIndex(
            model_name='course',
            index=models.Index(fields=['code'], name='blogs_cours_code_ea9bec_idx'),
        ),
    ]
