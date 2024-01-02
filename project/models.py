from django.core.exceptions import ValidationError
from django.db import models

from images.models import Photo
from user.models import User


class Project(models.Model):
    id = models.AutoField(primary_key=True, blank=True)
    fk_userid = models.ForeignKey(
        User, models.DO_NOTHING, db_column="fk_Userid", blank=True
    )
    fk_photoid = models.ForeignKey(
        Photo,
        models.DO_NOTHING,
        db_column="fk_Photoid",
        blank=True,
        null=True,
    )
    name = models.CharField(max_length=255, blank=True)
    edit_time = models.DateTimeField(auto_now_add=True)
    offsetX = models.FloatField(blank=True)
    offsetY = models.FloatField(blank=True)
    scaleX = models.FloatField(blank=True)
    scaleY = models.FloatField(blank=True)
    screenPath = models.CharField(max_length=255, blank=True)

    class Meta:
        managed = True
        db_table = "project"
