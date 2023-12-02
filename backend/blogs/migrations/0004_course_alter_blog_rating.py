# Generated by Django 4.2.7 on 2023-12-01 13:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blogs', '0003_alter_blog_options_alter_comment_options_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=8, unique=True)),
                ('name', models.CharField(max_length=100)),
            ],
            options={
                'ordering': ('code', 'name'),
            },
        ),
        migrations.AlterField(
            model_name='blog',
            name='rating',
            field=models.PositiveSmallIntegerField(default=0),
        ),
    ]
