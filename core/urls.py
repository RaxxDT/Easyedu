from django.urls import path
from . import views



urlpatterns = [
    path('', views.index_view, name='index'),
    # path('login/', views.login_view, name='login'),
    # path('signup/', views.signup_view, name='signup'),
    # path('dashboard/', views.dashboard_student_view, name='dashboard_student'),
    # path('dashboard/', views.dashboard_instructor_view, name='dashboard_instructor'),
    path('courses/', views.courses_view, name='courses'),
    path('assignment/', views.assignment_view, name='assignment'),
    path('chat/', views.chat_view, name='chat'),
]
