from django.db import models
from django.contrib.auth import get_user_model
from apps.products.models import Product  # Asegúrate de importar el modelo Product

User = get_user_model()

class Stock(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='stocks')  # Relación de uno a muchos
    quantity = models.DecimalField(max_digits=15, decimal_places=2)
    date = models.DateTimeField(auto_now=True)
    modified_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f'Stock for {self.product.name} on {self.date}'
