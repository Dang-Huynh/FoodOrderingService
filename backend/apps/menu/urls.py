from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import RestaurantViewSet, MenuItemViewSet

router = DefaultRouter()
router.register(r'restaurants', RestaurantViewSet)
router.register(r'menu-items', MenuItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
