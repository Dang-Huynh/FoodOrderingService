from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, UserProfile

# --- User/Admin serializers ---
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'role', 'is_active', 'is_staff', 'is_superuser']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'user', 'full_name', 'phone_number', 'profile_picture_url',
            'address', 'city', 'country', 'date_of_birth', 'preferences'
        ]

# --- Registration ---
class RegisterSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['email', 'password', 'full_name']

    def create(self, validated_data):
        full_name = validated_data.pop('full_name')
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user, full_name=full_name)
        return user

# --- Login ---
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        user = authenticate(email=email, password=password)
        if not user:
            raise serializers.ValidationError("Invalid email or password")
        attrs['user'] = user
        return attrs
