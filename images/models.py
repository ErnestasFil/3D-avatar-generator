from django.db import models

from user.models import User


class Photo(models.Model):
    id = models.AutoField(primary_key=True, blank=True)
    fk_userid = models.ForeignKey(
        User, models.DO_NOTHING, db_column="fk_Userid", blank=True
    )
    name = models.CharField(max_length=255, blank=True)
    path = models.CharField(max_length=255, blank=True)
    upload_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = True
        db_table = "photo"
