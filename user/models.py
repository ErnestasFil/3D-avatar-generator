from django.contrib.auth.hashers import check_password
from django.db import models


class User(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, blank=True)
    surname = models.CharField(max_length=255, blank=True)
    email = models.CharField(max_length=255, blank=True)
    password = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    class Meta:
        managed = True
        db_table = "user"
