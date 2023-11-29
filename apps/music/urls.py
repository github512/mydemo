#!/usr/bin/python3
# -*- coding: utf-8 -*-


from django.urls import path,include
from apps.music.api import views,base
 
urlpatterns = [
    path('fbv/list',base.course_list ,name="fbv-list")
]
