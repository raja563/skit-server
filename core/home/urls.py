from .views import person, personDetail, login, enquiry, facultyRegister, student, studentLogin, facultyLogin
from .views import (
    RegisterView, UserLoginView, LogoutView, UserListView, UserDeleteView, ForgetPasswordView
)
from django.urls import path
from .views import decideFees, syllabus, decideExamFees, decideHostelFees, decideTransportFees
from .views import dpfees_list_create, dpfees_detail
from .views import dpexamfees, dpexamfees_detail, dp_hostel, dp_hostel_detail, dp_transport, dp_transport_detail
from .views import quick_enquiry, staff_list_create, staff_detail, career_list, career_detail
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)



urlpatterns = [
    path('person/', person),
    path('enquiry/', enquiry, name="enquiry"),
    path('quickenq/', quick_enquiry, name="quick enquiry"),
    path('person_edit/<int:pk>/', personDetail, name='person-detail'),
    
    path('register/', RegisterView.as_view()),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('logout/', LogoutView.as_view()),
    path('users/', UserListView.as_view(), name='get-all-user'),
    path('users/<int:pk>/delete/', UserDeleteView.as_view(), name='user-delete'),
    # Forget password (reset with email)
    path('users/forget-password/', ForgetPasswordView.as_view(), name='forget-password'),
    
    path('faculty/register/', views.facultyRegister),
    path('faculty/login/', views.facultyLogin),
    path('faculty/logout/', views.facultyLogout),
    path('faculty/reset-password/', views.facultyResetPassword),
    path('faculty/<int:pk>/', views.facultyDetailUpdateDelete, name='get-update-delete-faculty'),
    # syllabus 
    path("syllabus/", syllabus, name="syllabus"),


    # student
    path('student/', student, name='student sign-up'),
    path('student/<int:pk>/', student , name='get-student-info'),
    path('student/login/', studentLogin, name='student-login'),

    # fees 
    path('decideFees/', decideFees, name='decideFees'),
    path('dEfee/', decideExamFees, name='decideExamFees'),
    path('dHfee/', decideHostelFees, name='decideHostelFees'),
    path('dTfee/', decideTransportFees, name='decideTransportationFees'),

    # deposite fee 
    path('dpfees/', dpfees_list_create, name='dpfees-list-create'),
    path('dpfees/<int:pk>/', dpfees_detail, name='dpfees-detail'),
   
    # deposite exam fee 
    path('dpefee/', dpexamfees, name='dp-examfee'),
    path('dpefee/<int:pk>/', dpexamfees_detail, name='dphostelfees-detail'),
   
    # deposite Hostel fee 
    path('dphfee/', dp_hostel, name='dp-examfee'),
    path('dphfee/<int:pk>/', dp_hostel_detail, name='dphostelfees-detail'),
    
    # deposite Transport fee 
    path('dptfee/', dp_transport , name='dp-transportfee'),
    path('dptfee/<int:pk>/', dp_transport_detail, name='dptransportfees-detail'),

    # staff 
    path('staff/', staff_list_create, name='staff-list' ),
    path('staff/<int:pk>/', staff_detail, name='staff-list-details'),

    # career 
    path('career/', career_list, name='career-list'),            # GET all, POST, DELETE all
    path('career/<int:pk>/', career_detail, name='career-detail'),
]
