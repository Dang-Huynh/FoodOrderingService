from django.urls import path
from .views import RestaurantListCreateAPIView, RestaurantDetailAPIView, MenuItemListCreateAPIView

urlpatterns = [
    # List & search restaurants
    path("restaurants/", RestaurantListCreateAPIView.as_view(), name="restaurants-list"),

    # Restaurant detail
    path("restaurants/<int:pk>/", RestaurantDetailAPIView.as_view(), name="restaurant-detail"),

    # Menu items for a restaurant
    path("restaurants/<int:restaurant_id>/menu/", MenuItemListCreateAPIView.as_view(), name="restaurant-menu"),
]
