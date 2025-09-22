from django.db import models
from django.conf import settings
from apps.menu.models import Restaurant, MenuItem

class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        PREPARING = "PREPARING", "Preparing"
        READY_FOR_PICKUP = "READY_FOR_PICKUP", "Ready for pickup"
        PICKED_UP = "PICKED_UP", "Picked up"
        CANCELLED = "CANCELLED", "Cancelled"
        FAILED = "FAILED", "Failed"

    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.RESTRICT,
                             related_name="orders")
    restaurant = models.ForeignKey(Restaurant,
                                   on_delete=models.RESTRICT,
                                   related_name="orders")

    status = models.CharField(max_length=32, choices=Status.choices, default=Status.PENDING)

    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # pickup-only fields
    pickup_code = models.CharField(max_length=12, blank=True)  # generate on creation
    ready_at = models.DateTimeField(null=True, blank=True)
    picked_up_at = models.DateTimeField(null=True, blank=True)
    pickup_name = models.CharField(max_length=120, blank=True)
    pickup_instructions = models.TextField(blank=True)

    placed_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.pk} - {self.restaurant.name}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order,
                              on_delete=models.CASCADE,
                              related_name="items")
    menu_item = models.ForeignKey(MenuItem,
                                  null=True, blank=True,
                                  on_delete=models.SET_NULL,
                                  related_name="order_items")
    # snapshots
    item_name = models.CharField(max_length=180)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    line_total = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.item_name} x{self.quantity}"

class Payment(models.Model):
    class Provider(models.TextChoices):
        STRIPE = "STRIPE", "Stripe"

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        PAID = "PAID", "Paid"
        FAILED = "FAILED", "Failed"
        REFUNDED = "REFUNDED", "Refunded"

    order = models.OneToOneField(Order,
                                 on_delete=models.RESTRICT,
                                 related_name="payment")
    provider = models.CharField(max_length=24, choices=Provider.choices, default=Provider.STRIPE)
    status = models.CharField(max_length=24, choices=Status.choices, default=Status.PENDING)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default="USD")
    transaction_id = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment for Order #{self.order_id} ({self.status})"
