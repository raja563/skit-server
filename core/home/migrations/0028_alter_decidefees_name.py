# Generated by Django 5.2.3 on 2025-07-09 07:45

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0027_decidefees_delete_feesdeposite'),
    ]

    operations = [
        migrations.AlterField(
            model_name='decidefees',
            name='name',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='fees', to='home.student'),
        ),
    ]
