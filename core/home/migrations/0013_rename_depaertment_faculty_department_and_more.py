# Generated by Django 5.2.3 on 2025-06-26 07:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0012_alter_faculty_dobirth_alter_faculty_dojoin'),
    ]

    operations = [
        migrations.RenameField(
            model_name='faculty',
            old_name='depaertment',
            new_name='department',
        ),
        migrations.RemoveField(
            model_name='faculty',
            name='fname',
        ),
    ]
