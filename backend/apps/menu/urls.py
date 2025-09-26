from django.urls import path
from .views import (
    RestaurantListCreateAPIView,
    RestaurantDetailAPIView,
    MenuItemListCreateAPIView,
)

urlpatterns = [
    path("restaurants/", RestaurantListCreateAPIView.as_view(), name="restaurant-list"),
    path("restaurants/<int:pk>/", RestaurantDetailAPIView.as_view(), name="restaurant-detail"),
    path("restaurants/<int:restaurant_id>/menu/", MenuItemListCreateAPIView.as_view(), name="menuitem-list"),
]
