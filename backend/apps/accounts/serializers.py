from rest_framework import serializers
from .models import User, UserProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'role', 'is_active', 'is_staff', 'is_superuser']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['user', 'full_name', 'phone_number', 'profile_picture_url', 'address', 'city', 'country', 'date_of_birth', 'preferences']
