# apps/menu/serializers.py
from rest_framework.serializers import ModelSerializer
from .models import Restaurant, MenuItem

class RestaurantSerializer(ModelSerializer):
    class Meta:
        model = Restaurant
        fields = (
            "id", "owner_user", "name", "cuisine_type",
            "phone", "email", "address", "is_active",
            "created_at", "updated_at"
        )

class MenuItemSerializer(ModelSerializer):
    class Meta:
        model = MenuItem
        fields = (
            "id", "restaurant", "name", "description",
            "price", "is_available", "image_url",
            "created_at", "updated_at"
        )
