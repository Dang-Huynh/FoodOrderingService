from rest_framework import serializers
from .models import Restaurant, MenuItem

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = ["id", "name", "description", "price", "image", "is_available"]

class RestaurantSerializer(serializers.ModelSerializer):
    menu = MenuItemSerializer(source="menu_items", many=True)

    class Meta:
        model = Restaurant
        fields = [
            "id",
            "name",
            "cuisine_type",
            "image",
            "rating",
            "distance",
            "deliveryTime",
            "deliveryFee",
            "offer",
            "menu",
        ]
