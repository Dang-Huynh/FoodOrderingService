from rest_framework import serializers
from .models import Restaurant, MenuItem

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = [
            "id",
            "name",
            "description",
            "price",
            "is_available",
            "image_url",
            "created_at",
            "updated_at",
        ]


class RestaurantSerializer(serializers.ModelSerializer):
    menu_items = MenuItemSerializer(many=True, read_only=True)

    class Meta:
        model = Restaurant
        fields = [
            "id",
            "owner_user",
            "name",
            "cuisine_type",
            "phone",
            "email",
            "address",
            "is_active",
            "created_at",
            "updated_at",
            "menu_items",
            'image',
        ]
        read_only_fields = ["owner_user", "created_at", "updated_at"]
