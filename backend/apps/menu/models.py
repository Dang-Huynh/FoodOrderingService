from django.db import models
from django.conf import settings

class RestaurantQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_active=True)

class MenuItemQuerySet(models.QuerySet):
    def available(self):
        return self.filter(is_available=True)

class Restaurant(models.Model):
    owner_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.RESTRICT,
        related_name="restaurants"
    )
    name = models.CharField(max_length=180)
    cuisine_type = models.CharField(max_length=80, blank=True)
    phone = models.CharField(max_length=40, blank=True)
    email = models.EmailField(blank=True)
    address = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    image = models.URLField(max_length=500, blank=True, null=True)  # <-- switched

    # Optional fields for frontend display
    rating = models.DecimalField(max_digits=3, decimal_places=1, blank=True, null=True)
    distance = models.CharField(max_length=50, blank=True)
    deliveryTime = models.CharField(max_length=50, blank=True)
    deliveryFee = models.CharField(max_length=50, blank=True)
    offer = models.CharField(max_length=255, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = RestaurantQuerySet.as_manager()

    def __str__(self):
        return self.name


class MenuItem(models.Model):
    restaurant = models.ForeignKey(
        Restaurant,
        on_delete=models.RESTRICT,
        related_name="menu_items"
    )
    name = models.CharField(max_length=180)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50, blank=True)
    is_available = models.BooleanField(default=True)
    image = models.URLField(max_length=500, blank=True, null=True)  # <-- switched
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = MenuItemQuerySet.as_manager()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["restaurant", "name"],
                name="uniq_menuitem_name_per_restaurant",
            )
        ]
        indexes = [
            models.Index(fields=["restaurant", "is_available"]),
        ]

    def __str__(self):
        return f"{self.name} ({self.restaurant.name})"
