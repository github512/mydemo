#!/usr/bin/python3
# -*- coding: utf-8 -*-


from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from apps.music.models import Course
from apps.music.serializers import CourseSerializer

@api_view(["GET","POST"])
def course_list(request):
	# ================================================= #
	# *******获取所有课程信息或新增一个课程****** #
	# ================================================= #

	if request.method == "GET":
		s = CourseSerializer(instance = Course.objects.all(),many=True)
		return Response(data=s.data,status = status.HTTP_200_OK)
	elif request.method == "POST":
		s = CourseSerializer(data = request.data , partial=True)#部分更新可用partial=True
		if s.is_valid():
			s.save(teacher=request.user)
			return Response(data=s.data,status=status.HTTP_201_CREATED)
		return Response(s.errors,status.HTTP_400_BAD_REQUEST)