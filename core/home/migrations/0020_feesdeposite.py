# Generated by Django 5.2.3 on 2025-07-01 05:45

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0019_student'),
    ]

    operations = [
        migrations.CreateModel(
            name='FeesDeposite',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('selectYear', models.CharField()),
                ('department', models.CharField()),
                ('semester', models.CharField(max_length=2)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('date_paid', models.DateField(auto_now_add=True)),
                ('payment_method', models.CharField(choices=[('cash', 'Cash'), ('online', 'Online'), ('cheque', 'Cheque')], max_length=50)),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fees', to='home.student')),
            ],
        ),
    ]
