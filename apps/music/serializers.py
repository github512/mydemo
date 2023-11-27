#!/usr/bin/python3
# -*- coding: utf-8 -*-

from django import forms
from rest_framework import serializers
from .models import  Author,Course



class AuthorForm(forms.ModelForm):
	class Meta:
		model = Author
		fields = '__all__'



class CourseSerializer(serializers.ModelSerializer):
	teacher = serializers.ReadOnlyField(source='teacher.name')

	class Meta:
		model = Course
		#exclude = ('id',) #注意元组中只有1个元素时不能写成（"id"）
		#fields = ('id','name','introduction','teacher','price','created_at','update_at') 
		fields = '__all__'


# class CourseSerializer(serializers.HyperlinkedModelSerializer):
# 	teacher = serializers.ReadOnlyField(source='teacher.name')

# 	class Meta:
# 		model = Course
# 		#exclude = ('id',) #注意元组中只有1个元素时不能写成（"id"）
# 		#fields = ('id','name','introduction','teacher','price','created_at','update_at') 
# 		fields = '__all__'

