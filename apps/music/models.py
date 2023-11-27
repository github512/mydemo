from django.db import models

from apps.clients.models import Musician
from django.conf import settings




class Author(models.Model):
    name = models.CharField(max_length=64)
    book = models.ForeignKey("Book", on_delete=models.CASCADE,default=None,related_name='book')
    def __unicode__(self):
    	return self.name


class Book(models.Model):
	name = models.CharField(max_length=64)
	author = models.ManyToManyField(Author,related_name="author")
	def __unicode__(self):
		return self.name


class Course(models.Model):
	name = models.CharField(max_length=255,unique=True,help_text='课程名称',verbose_name='名称')
	introduction = models.TextField(help_text='课程介绍',verbose_name='介绍')
	teacher = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,help_text='课程讲师',verbose_name='讲师')
	price = models.DecimalField(max_digits=6,decimal_places=2,help_text='课程价格',verbose_name='价格')
	created_at = models.DateTimeField(auto_now_add=True,verbose_name='创建时间')
	update_at = models.DateTimeField(auto_now=True,verbose_name='更新时间')

	class Meta:
		verbose_name = '课程信息'
		verbose_name_plural = verbose_name
		ordering = ('price',)

	def __str__(self):
		return self.name

