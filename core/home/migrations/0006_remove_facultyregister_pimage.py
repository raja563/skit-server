# Generated by Django 5.2.3 on 2025-06-26 06:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0005_facultyregister'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='facultyregister',
            name='pimage',
        ),
    ]
