# backend/backend/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.menu.views import RestaurantViewSet, MenuItemViewSet
from apps.accounts.views import UserProfileViewSet, UserViewSet
from apps.orders.views import OrderItemViewSet,PaymentViewSet,OrderViewSet

router = DefaultRouter()
router.register(r"restaurants", RestaurantViewSet, basename="restaurant")
router.register(r"menu_items", MenuItemViewSet, basename="menu_item")
router.register(r"users",UserViewSet, basename="user")
router.register(r"user_profile",UserProfileViewSet, basename="user_profile")
router.register(r"order_item",OrderItemViewSet, basename="order_item")
router.register(r"orders",OrderViewSet, basename="order")
router.register(r"payment",PaymentViewSet, basename="payment")

urlpatterns = [
    path("", include(router.urls)),
]
