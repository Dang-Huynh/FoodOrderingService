from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import OrderViewSet, OrderItemViewSet, PaymentViewSet

router = DefaultRouter()
router.register(r'', OrderViewSet, basename='orders')                 # /api/orders/
router.register(r'items', OrderItemViewSet, basename='order-items')   # /api/orders/items/
router.register(r'payments', PaymentViewSet, basename='payments') 

urlpatterns = [
    path('', include(router.urls)),
]
