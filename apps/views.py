from django.shortcuts import render

import datetime

from apps.models import Musician

# Create your views here.

from django.http import HttpResponse, JsonResponse

# ================================================= #
# 1. Insert statement
# ================================================= #


def index(request):
    now = datetime.datetime.now()
    html = "<html><body>It is now %s.</body></html>" % now
    p=Musician.objects.create(first_name="张三",last_name='20231111',instrument='10')
    p.save()
    qs=Musician.objects.values()
    retlist = list(qs)

    print(retlist)
    return HttpResponse(html)
    #return JsonResponse({'ret': 0, 'retlist': retlist})


# ================================================= #
# 1. Pass variables to the page
# ================================================= #


def html(request):
    qs=Musician.objects.values()
    retlist = list(qs)
    a = {'name': retlist }  
    return render(request, 'index.html',a)


