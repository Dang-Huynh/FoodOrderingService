from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from django.conf import settings

# --- NEW: email-based manager ---
class EmailUserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("The Email must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        return self._create_user(email, password, **extra_fields)

class User(AbstractUser):
    # remove username; use email for login
    username = None
    email = models.EmailField(unique=True)

    CUSTOMER = "customer"
    STAFF = "restaurant_staff"
    ADMIN = "admin"
    ROLE_CHOICES = [
        (CUSTOMER, "Customer"),
        (STAFF, "Restaurant Staff"),
        (ADMIN, "Admin"),
    ]
    role = models.CharField(max_length=32, choices=ROLE_CHOICES, default=CUSTOMER)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []  # no username required

    objects = EmailUserManager()  # <-- use the new manager

    def __str__(self):
        return self.email

class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        primary_key=True,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    full_name = models.CharField(max_length=120, blank=True)
    phone_number = models.CharField(max_length=32, blank=True)
    profile_picture_url = models.URLField(blank=True)
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    preferences = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile({self.user})"
