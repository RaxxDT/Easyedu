from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .forms import UserSignupForm, ProfileForm, LoginForm, UserForm
from django.contrib.auth.views import LoginView, LogoutView
from django.views.generic import CreateView
from django.urls import reverse_lazy, reverse
from .models import UserProfile, User, PasswordResetOTP
from django.contrib import messages
from django.core.mail import send_mail
import random
from django.contrib.auth import update_session_auth_hash

# Create your views here.
class SignupView(CreateView):
    form_class = UserSignupForm
    template_name = 'signup.html'
    
    success_url = reverse_lazy('login')


class CustomLoginView(LoginView):
    template_name = 'login.html'
    authentication_form = LoginForm 
    
    def get_success_url(self):
        user = self.request.user
        if user.role == 'student':
            return reverse_lazy('dashboard')  
        return reverse_lazy('instructor-dashboard')

@login_required
def dashboard(request):
    if request.user.role == 'student':
        return render(request, 'dashboard.html')
    return render(request, 'instructor-dashboard.html'
    )


@login_required
def instructor_dashboard(request):
    return render(request, 'instructor-dashboard.html')

@login_required
def profile_view(request):
    profile = request.user
    profile = request.user.userprofile  # (user.profile) would be better anyway. Assuming you have a related_name set for UserProfile in your User model
    context = {"profile": profile,}
    return render(request, 'profile_page.html', context)


def edit_profile_view(request):
    user = request.user
    profile, created = UserProfile.objects.get_or_create(user=user)
    if request.method == 'POST':
        u_form = UserForm(request.POST, instance=user)
        p_form = ProfileForm(request.POST, request.FILES, instance=profile) 
        #request.FILES is used to handle file uploads like images, while request.POST is used for regular form data
        if u_form.is_valid() and p_form.is_valid():
            u_form.save()
            p_form.save()
            messages.success(request, "Your profile has been updated successfully ✅.")
            return redirect('profile')
    else:
        u_form = UserForm(instance=user)
        p_form = ProfileForm(instance=profile)  # Redirect to the profile view for editing
    context = {
        'u_form': u_form,
        'p_form': p_form,
    }
    return render(request, 'edit_profile.html', context)


def reset_password_view(request):
    show_form = False

    if request.method == 'POST':
        if 'send_otp' in request.POST:
            # We use the name 'send_otp' to identify the button that sends the OTP in the form
            # Handle sending OTP logic here
            user = request.user

            if not user.email:
                messages.error(request, "Please set an email address in your profile before requesting a password reset.")
                return redirect('edit_profile')
            otp = str(random.randint(100000, 999999))

            # Save or update OTP
            PasswordResetOTP.objects.update_or_create(
                user=user,
                defaults={'otp_code': otp}
            )

            # Send email
            send_mail(
                subject="Password Reset OTP",
                message=f"Your OTP is {otp}",  # This is the OTP that the user will use to reset their password
                from_email="EasyEdu@gmail.com",
                recipient_list=[user.email],
                fail_silently=False,
            )

            messages.success(request, "OTP sent to your email.")
        # Here you would handle the logic for sending the OTP and resetting the password
        # For now, we can just set show_form to True to display the form
        elif 'reset_password' in request.POST:
            otp_input = request.POST.get('otp')
            new_pw = request.POST.get('new_password1')
            confirm_pw = request.POST.get('new_password2')

            try:
                otp_record = PasswordResetOTP.objects.get(user=request.user)
            except PasswordResetOTP.DoesNotExist:
                messages.error(request, "Please request an OTP first.")
                return redirect('reset_password')

            if otp_record.is_expired():
                otp_record.delete()
                messages.error(request, "OTP expired. Request a new one.")
                return redirect('reset_password')

            if otp_record.otp_code != otp_input:
                messages.error(request, "Invalid OTP.")
                return redirect('reset_password')

            if new_pw != confirm_pw:
                messages.error(request, "Passwords do not match.")
                return redirect('reset_password')

            user = request.user
            user.set_password(new_pw)
            user.save()
            otp_record.delete()
            update_session_auth_hash(request, user)

            messages.success(request, "Password updated successfully!")
            return redirect('profile')
    else:
        show_form = PasswordResetOTP.objects.filter(user=request.user).exists()    
    # This view would handle password reset logic
    # For now, we can just render a placeholder template
    return render(request, 'reset_password.html', {'show_form': show_form}) 
    # show_form is used to determine whether to show the OTP form or not
