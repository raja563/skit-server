# Generated by Django 5.2.3 on 2025-07-11 07:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0043_remove_decidehostelfee_student_id_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='student',
            name='student_id',
            field=models.CharField(default='', editable=False, max_length=20, null=True, unique=True),
        ),
    ]
