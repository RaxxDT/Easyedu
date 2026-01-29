from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import UserProfile,User

#Once a user is created, a profile would be created for them automatically.

@receiver(post_save, sender=User) #You want to create a profile when a user is created or modified
def create_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
    else:
        instance.userprofile.save() #You can use related_name = "" to access the profile directly, but this is a more explicit way to ensure the profile is saved if it already exists.