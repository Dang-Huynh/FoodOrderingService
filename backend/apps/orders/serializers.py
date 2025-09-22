from rest_framework import serializers
from .models import Order, OrderItem, Payment

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["id", "menu_item", "item_name", "unit_price", "quantity", "line_total"]

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ["id", "provider", "status", "amount", "currency", "transaction_id"]

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    payment = PaymentSerializer(read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "user", "restaurant", "status",
            "subtotal", "tax", "total_amount",
            "pickup_code", "ready_at", "picked_up_at",
            "pickup_name", "pickup_instructions",
            "placed_at", "updated_at", "items", "payment"
        ]
