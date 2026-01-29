from django.shortcuts import render

def index_view(request):
    return render(request, 'index.html')

def login_view(request):
    return render(request, 'login.html')

def signup_view(request):
    return render(request, 'signup.html')

def dashboard_student_view(request):
    return render(request, 'dashboard.html')

def dashboard_instructor_view(request):
    return render(request, 'dashboard-instructor.html')

def courses_view(request):
    return render(request, 'courses.html')

def assignment_view(request):
    return render(request, 'assignment.html')

def chat_view(request):
    return render(request, 'chat.html')