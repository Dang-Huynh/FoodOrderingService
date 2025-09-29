from rest_framework import generics
from .models import Restaurant, MenuItem
from .serializers import RestaurantSerializer, MenuItemSerializer

class RestaurantListCreateAPIView(generics.ListCreateAPIView):
    queryset = Restaurant.objects.active()
    serializer_class = RestaurantSerializer

class RestaurantDetailAPIView(generics.RetrieveAPIView):
    queryset = Restaurant.objects.active()
    serializer_class = RestaurantSerializer

class MenuItemListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = MenuItemSerializer

    def get_queryset(self):
        restaurant_id = self.kwargs["restaurant_id"]
        return MenuItem.objects.filter(restaurant_id=restaurant_id, is_available=True)
