from rest_framework import serializers
from .models import User, UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            "full_name", "phone_number", "profile_picture_url",
            "address", "city", "country", "date_of_birth",
            "preferences", "created_at", "updated_at"
        ]

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["id", "email", "role", "is_active", "profile"]
