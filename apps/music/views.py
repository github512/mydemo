from django.shortcuts import render

# Create your views here.
import json
from django.http import JsonResponse,HttpResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


course_dict = {
	'name': '课程名称',
	'introduction ': '课程介绍',
	'price': 50 
}



#使用原生的API接口
def course_list(request):

	if request.method == 'GET':
		return JsonResponse(course_dict)
	if request.method =='POST':
		course = json.loads(request.body.decode('utf-8'))
		return HttpResponse(json.dumps(course),content_type='application/json')



#Django CBV 编写API接口
@method_decorator(csrf_exempt,name='dispatch')
class CourseList(View):

	def get(self,request):
		return JsonResponse(course_dict)

	def port(self,request):
		course = json.loads(request.body.decode('utf-8'))
		return HttpResponse(json.dumps(course),content_type='application/json')





#分页、排序、认证、权限、限流等等












		