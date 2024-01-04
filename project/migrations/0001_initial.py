# Generated by Django 5.0 on 2024-01-04 03:52

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('images', '0001_initial'),
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(blank=True, max_length=255)),
                ('edit_time', models.DateTimeField(auto_now_add=True)),
                ('offsetX', models.FloatField(blank=True)),
                ('offsetY', models.FloatField(blank=True)),
                ('scaleX', models.FloatField(blank=True)),
                ('scaleY', models.FloatField(blank=True)),
                ('screenPath', models.CharField(blank=True, max_length=255)),
                ('fk_photoid', models.ForeignKey(blank=True, db_column='fk_Photoid', null=True, on_delete=django.db.models.deletion.CASCADE, to='images.photo')),
                ('fk_userid', models.ForeignKey(blank=True, db_column='fk_Userid', on_delete=django.db.models.deletion.DO_NOTHING, to='user.user')),
            ],
            options={
                'db_table': 'project',
                'managed': True,
            },
        ),
    ]
