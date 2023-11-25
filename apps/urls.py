from django.urls import path,include
from apps import views as apps_view

# 使用rest框架自带的路由器生成路由列表
from rest_framework.routers import DefaultRouter

# 使用 drf_yasg API文档生成器 视图和openapi
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# 导入权限控制模块
from rest_framework import permissions

from django.contrib import admin
from django.urls import path,include


urlpatterns = [

    path('html/', apps_view.html),
	path('index/', apps_view.index),
]
