from rest_framework import serializers
from .models import Restaurant, MenuItem

class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'owner_user', 'cuisine_type', 'phone', 'email', 'address', 'is_active']

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = ['id', 'restaurant', 'name', 'description', 'price', 'is_available', 'image_url']
