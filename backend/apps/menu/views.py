from rest_framework import generics, permissions
from .models import Restaurant, MenuItem
from .serializers import RestaurantSerializer, MenuItemSerializer
from django.db.models import Q

class RestaurantListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # Start from active restaurants
        qs = Restaurant.objects.active()

        # Get query parameters
        q = self.request.query_params.get("q", "").strip()
        address = self.request.query_params.get("address", "").strip()

        # Filter by name or cuisine type if query exists
        if q:
            qs = qs.filter(
                Q(name__icontains=q) | Q(cuisine_type__icontains=q)
            )

        # Filter by address if provided
        if q:
            qs = qs.filter(Q(name__icontains=q) | Q(cuisine_type__icontains=q))
        if address:
            qs = qs.filter(address__icontains=address)

        return qs

    def perform_create(self, serializer):
        serializer.save(owner_user=self.request.user)



class RestaurantDetailAPIView(generics.RetrieveUpdateAPIView):
    queryset = Restaurant.objects.active()
    serializer_class = RestaurantSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class MenuItemListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        restaurant_id = self.kwargs["restaurant_id"]
        return MenuItem.objects.filter(
            restaurant_id=restaurant_id, is_available=True
        )

    def get_serializer_context(self):
        # Pass request context so SerializerMethodField can build absolute URLs
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    def perform_create(self, serializer):
        restaurant_id = self.kwargs["restaurant_id"]
        serializer.save(restaurant_id=restaurant_id)
