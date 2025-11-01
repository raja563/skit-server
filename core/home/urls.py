from django.urls import path
from . import views
from .views import (
    person, personDetail, login, enquiry, quick_enquiry,
    facultyRegister, facultyLogin, facultyLogout, facultyResetPassword, facultyDetailUpdateDelete,
    student, studentLogin,
    syllabus,
    decideFees, decideExamFees, decideHostelFees, decideTransportFees,
    dpfees_list_create, dpfees_detail,
    dpexamfees, dpexamfees_detail,
    dp_hostel, dp_hostel_detail,
    dp_transport, dp_transport_detail,
    staff_list_create, staff_detail,
    career_list, career_detail,
    RegisterView, UserLoginView, LogoutView, UserListView, UserDeleteView, ForgetPasswordView
)

urlpatterns = [
    # Person
    path('person/', person),
    path('person_edit/<int:pk>/', personDetail, name='person-detail'),

    # Enquiry
    path('enquiry/', enquiry, name="enquiry"),
    path('quickenq/', quick_enquiry, name="quick-enquiry"),

    # User Auth
    path('register/', RegisterView.as_view()),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('logout/', LogoutView.as_view()),
    path('users/', UserListView.as_view(), name='get-all-user'),
    path('users/<int:pk>/delete/', UserDeleteView.as_view(), name='user-delete'),
    path('users/forget-password/', ForgetPasswordView.as_view(), name='forget-password'),

    # Faculty
    path('faculty/register/', facultyRegister),
    path('faculty/login/', facultyLogin),
    path('faculty/logout/', facultyLogout),
    path('faculty/reset-password/', facultyResetPassword),
    path('faculty/<int:pk>/', facultyDetailUpdateDelete, name='get-update-delete-faculty'),

    # Syllabus
    path("syllabus/", syllabus, name="syllabus"),

    # Student
    path('student/', student, name='student-signup'),
    path('student/<int:pk>/', student, name='get-student-info'),
    path('student/login/', studentLogin, name='student-login'),
    
     # 🟢 Attendance sessions (create/view)
    path('attendance/', views.AttendanceListCreateView.as_view(), name='attendance-list'),

    # 🟢 Attendance records (create/view)
    path('attendance-records/', views.AttendanceRecordListCreateView.as_view(), name='attendance-records'),

    # 🟢 Mark attendance automatically (face recognition)
    path('mark-attendance/', views.mark_attendance, name='mark-attendance'),

    # 🟢 Get student info or primary key
    path('student/<int:pk>/', views.student, name='get-student-info'),
    path('get-student-pk/', views.get_student_pk, name='get-student-pk'),
    
    # Decide Fees
    path('decideFees/', decideFees, name='decideFees'),
    path('dEfee/', decideExamFees, name='decideExamFees'),
    path('dHfee/', decideHostelFees, name='decideHostelFees'),
    path('dTfee/', decideTransportFees, name='decideTransportationFees'),

    # Deposit Academic Fee
    path('dpfees/', dpfees_list_create, name='dpfees-list-create'),
    path('dpfees/<int:pk>/', dpfees_detail, name='dpfees-detail'),

    # Deposit Exam Fee
    path('dpefee/', dpexamfees, name='dp-examfee'),
    path('dpefee/<int:pk>/', dpexamfees_detail, name='dpexamfee-detail'),

    # Deposit Hostel Fee
    path('dphfee/', dp_hostel, name='dp-hostelfee'),
    path('dphfee/<int:pk>/', dp_hostel_detail, name='dphostelfees-detail'),

    # Deposit Transport Fee
    path('dptfee/', dp_transport, name='dp-transportfee'),
    path('dptfee/<int:pk>/', dp_transport_detail, name='dptransportfees-detail'),

    # Staff
    path('staff/', staff_list_create, name='staff-list'),
    path('staff/<int:pk>/', staff_detail, name='staff-detail'),

    # Career
    path('career/', career_list, name='career-list'),
    path('career/<int:pk>/', career_detail, name='career-detail'),
]
