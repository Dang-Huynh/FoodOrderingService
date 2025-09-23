from django.contrib import admin
from .models import Restaurant, MenuItem

# Register your models here.
@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "owner_user", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("name", "owner_user__email", "cuisine_type")
    autocomplete_fields = ("owner_user",)

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "restaurant", "price", "is_available")
    list_filter = ("restaurant", "is_available")
    search_fields = ("name", "restaurant__name")