# Generated by Django 5.2.3 on 2025-07-05 09:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0024_alter_feesdeposite_semester_alter_feesdeposite_year'),
    ]

    operations = [
        migrations.CreateModel(
            name='Faculty',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fullname', models.CharField()),
                ('fname', models.CharField()),
                ('gender', models.CharField()),
                ('dobirth', models.DateField()),
                ('address', models.CharField()),
                ('mobile', models.CharField()),
                ('email', models.EmailField(max_length=254)),
                ('qualification', models.CharField()),
                ('department', models.CharField()),
                ('dojoin', models.DateField()),
            ],
        ),
        migrations.DeleteModel(
            name='FacultyRegister',
        ),
    ]
