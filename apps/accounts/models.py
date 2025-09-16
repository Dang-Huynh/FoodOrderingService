from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # keep username/email/password from AbstractUser
    # simple role for v1 (you can also use Groups/Permissions)
    CUSTOMER = "customer"
    STAFF = "restaurant_staff"
    ADMIN = "admin"
    ROLE_CHOICES = [
        (CUSTOMER, "Customer"),
        (STAFF, "Restaurant Staff"),
        (ADMIN, "Admin"),
    ]
    role = models.CharField(max_length=32, choices=ROLE_CHOICES, default=CUSTOMER)

    def __str__(self):
        return self.username

class UserProfile(models.Model):
    # strict 1:1 (PK = FK)
    user = models.OneToOneField(settings.AUTH_USER_MODEL,
                                primary_key=True,
                                on_delete=models.CASCADE,
                                related_name="profile")
    full_name = models.CharField(max_length=120, blank=True)
    phone_number = models.CharField(max_length=32, blank=True)
    profile_picture_url = models.URLField(blank=True)
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    preferences = models.JSONField(null=True, blank=True)  # MySQL 8 JSON
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile({self.user})"
