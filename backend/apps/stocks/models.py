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

    # Método para actualizar stock y registrar en el historial
    def update_stock(self, new_quantity, reason, user):
        stock_before = self.quantity
        self.quantity = new_quantity
        self.save()  # Actualiza el stock actual

        # Crea una nueva entrada en el historial de stock
        StockHistory.objects.create(
            product=self.product,
            stock_before=stock_before,
            stock_after=new_quantity,
            change_reason=reason,
            user=user
        )


class StockHistory(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='stock_history')  # Relación con el producto
    stock_before = models.DecimalField(max_digits=15, decimal_places=2)  # Stock antes del cambio
    stock_after = models.DecimalField(max_digits=15, decimal_places=2)   # Stock después del cambio
    change_reason = models.TextField()  # Motivo del cambio
    recorded_at = models.DateTimeField(auto_now_add=True)  # Fecha del registro
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Usuario que realizó el cambio

    def __str__(self):
        return f'History for {self.product.name} - Change at {self.recorded_at}'
