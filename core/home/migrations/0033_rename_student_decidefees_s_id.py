# Generated by Django 5.2.3 on 2025-07-10 08:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0032_student_student_id_alter_student_session'),
    ]

    operations = [
        migrations.RenameField(
            model_name='decidefees',
            old_name='student',
            new_name='s_id',
        ),
    ]
