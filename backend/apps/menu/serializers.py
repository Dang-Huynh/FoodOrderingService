from rest_framework import serializers
from collections import defaultdict
from .models import Restaurant, MenuItem

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = ["id", "name", "description", "price", "image", "is_available", "category"]

class RestaurantSerializer(serializers.ModelSerializer):
    menu = serializers.SerializerMethodField()  # SerializerMethodField to compute grouping

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

    def get_menu(self, obj):
        grouped = defaultdict(list)
        for item in obj.menu_items.all():
            cat = item.category or "Uncategorized"
            grouped[cat].append(MenuItemSerializer(item).data)
        return grouped
