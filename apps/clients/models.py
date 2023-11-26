from django.db import models
from django.contrib.auth.models import AbstractUser



class Musician(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    instrument = models.CharField(max_length=100)


class Album(models.Model):
    name = models.CharField(max_length=100)
    release_date = models.CharField(max_length=100)
    num_stars = models.IntegerField()