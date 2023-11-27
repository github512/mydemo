from django.contrib import admin

# Register your models here.


from .models import Course


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
	list_display = ('name','introduction','teacher','price')
	search_fields = list_display
	list_filter = list_display