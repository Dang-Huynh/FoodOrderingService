from rest_framework import generics
from .models import Restaurant, MenuItem
from .serializers import RestaurantSerializer, MenuItemSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.exceptions import PermissionDenied

class RestaurantListCreateAPIView(generics.ListCreateAPIView):
    queryset = Restaurant.objects.active()
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        # Public can read (list)
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return [AllowAny()]
        # Writes require auth (and role check in perform_create)
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        # Optional: restrict creation to staff/admin only
        role = getattr(self.request.user, "role", "")
        if role not in ("staff", "admin"):
            raise PermissionDenied("Only staff/admin can create restaurants.")
        serializer.save(owner_user=self.request.user)

class RestaurantDetailAPIView(generics.RetrieveAPIView):
    queryset = Restaurant.objects.active()
    serializer_class = RestaurantSerializer
    permission_classes = [AllowAny]  # public can view details

class MenuItemListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = MenuItemSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        restaurant_id = self.kwargs["restaurant_id"]
        return MenuItem.objects.filter(restaurant_id=restaurant_id, is_available=True)

    def get_permissions(self):
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return [AllowAny()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        role = getattr(self.request.user, "role", "")
        if role not in ("staff", "admin"):
            raise PermissionDenied("Only staff/admin can add menu items.")
        serializer.save()
