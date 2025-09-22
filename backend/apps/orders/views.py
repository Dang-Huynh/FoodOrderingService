from rest_framework import viewsets
from .models import Order, OrderItem, Payment
from .serializers import OrderSerializer, OrderItemSerializer, PaymentSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().select_related("restaurant", "user")
    serializer_class = OrderSerializer

class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all().select_related("order", "menu_item")
    serializer_class = OrderItemSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all().select_related("order")
    serializer_class = PaymentSerializer
