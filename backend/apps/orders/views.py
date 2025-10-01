from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from decimal import Decimal
from .models import Order, OrderItem, Payment
from .serializers import OrderSerializer, OrderItemSerializer, PaymentSerializer

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only show the current user's orders
        return Order.objects.filter(user=self.request.user).select_related("restaurant").prefetch_related("items")
    
    @action(detail=False, methods=["post"])
    @transaction.atomic
    def place(self, request):

        data = request.data
        restaurant_id = data.get("restaurant_id")
        items = data.get("items", [])
        pickup_name = data.get("pickup_name", "")
        pickup_instructions = data.get("pickup_instructions", "")

        if not restaurant_id or not items:
            return Response({"detail": "restaurant_id and items are required."},
                            status=status.HTTP_400_BAD_REQUEST)

        # 1) Create order
        order = Order.objects.create(
            user=request.user,
            restaurant_id=restaurant_id,
            pickup_name=pickup_name,
            pickup_instructions=pickup_instructions,
        )

        # 2) Create order items (snapshot name + unit_price)
        for it in items:
            OrderItem.objects.create(
                order=order,
                menu_item_id=it.get("menu_item_id"),
                item_name=it["name"],
                unit_price=Decimal(it["unit_price"]),
                quantity=it.get("quantity", 1),
                line_total="0.00",  # will be computed in model.save()
                image_url=it.get("image", ""),
            )

        # 3) Recalc totals, create pending payment matching total
        order.recalc_totals()  # currently uses 0% tax in your model
        order.save(update_fields=["subtotal", "tax", "total_amount"])

        Payment.objects.create(
            order=order,
            amount=order.total_amount,
            status=Payment.Status.PENDING,
        )

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [permissions.IsAuthenticated]

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
