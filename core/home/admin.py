from django.contrib import admin
from home.models import Student, DecideFees, Syllabus, DpFees, DpExamFees, DpHostelFees, DpTransportFees, QuickEnquiry, Staff
from home.models import Career, FacultyMember
# Register your models here.
admin.site.register(Student)
admin.site.register(DecideFees)
admin.site.register(DpFees)
admin.site.register(DpExamFees)
admin.site.register(DpHostelFees)
admin.site.register(DpTransportFees)
admin.site.register(QuickEnquiry)
admin.site.register(Staff)
admin.site.register(Career)
admin.site.register(FacultyMember)



@admin.register(Syllabus)

class SyllabusModelAdmin(admin.ModelAdmin):
    list_display = ['course', 'year', 'syllabus']