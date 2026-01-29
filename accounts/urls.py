from django.urls import path
from .import views
from django.contrib.auth.views import LogoutView


urlpatterns = [
    path('login/', views.CustomLoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(next_page='index'), name='logout'), # Ensure you have a logout URL and this only uses a POST request and not a GET request
    path('profile/', views.profile_view, name='profile'),  # Assuming you have a profile view
    path('signup/', views.SignupView.as_view(), name='signup'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('instructor_dashboard/', views.instructor_dashboard, name='instructor-dashboard'),
    path('edit_profile/', views.edit_profile_view, name='edit_profile'),  
    # Assuming you want to edit the profile
    path('reset_password/', views.reset_password_view, name='reset_password'),  
    # Add your password reset view here
]

