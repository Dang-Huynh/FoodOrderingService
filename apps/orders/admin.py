from django.contrib import admin
from django.utils import timezone
from .models import Order, OrderItem, Payment

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    fields = ("item_name", "unit_price", "quantity", "line_total", "menu_item")
    autocomplete_fields = ("menu_item",)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "restaurant", "user", "status", "total_amount", "placed_at")
    list_filter = ("status", "restaurant")
    search_fields = ("id", "user__email", "restaurant__name", "pickup_code")
    date_hierarchy = "placed_at"
    inlines = [OrderItemInline]
    readonly_fields = ("subtotal", "tax", "total_amount", "pickup_code",
                       "placed_at", "updated_at", "ready_at", "picked_up_at")

    actions = ["mark_preparing", "mark_ready_for_pickup", "mark_picked_up"]

    def mark_preparing(self, request, queryset):
        queryset.update(status="PREPARING", updated_at=timezone.now())
    mark_preparing.short_description = "Set status to PREPARING"

    def mark_ready_for_pickup(self, request, queryset):
        queryset.update(status="READY_FOR_PICKUP", ready_at=timezone.now(), updated_at=timezone.now())
    mark_ready_for_pickup.short_description = "Set status to READY_FOR_PICKUP + set ready_at"

    def mark_picked_up(self, request, queryset):
        queryset.update(status="PICKED_UP", picked_up_at=timezone.now(), updated_at=timezone.now())
    mark_picked_up.short_description = "Set status to PICKED_UP + set picked_up_at"

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "item_name", "quantity", "line_total")
    search_fields = ("item_name", "order__id", "order__restaurant__name")

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "provider", "status", "amount", "created_at")
    list_filter = ("provider", "status")
    search_fields = ("transaction_id", "order__id")
