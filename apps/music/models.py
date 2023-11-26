from django.db import models

from apps.clients.models import Musician




class Author(models.Model):
    name = models.CharField(max_length=64)
    book = models.ForeignKey("Book", on_delete=models.CASCADE)
    def __unicode__(self):
    	return self.name


class Book(models.Model):
	name = models.CharField(max_length=64)
	author = models.ManyToManyField(Author)
	def __unicode__(self):
		return self.name



