import qrcode
from io import BytesIO
from django.core.files import File
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Modelo para Category
class Category(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='categories', null=True)

    def __str__(self):
        return self.name

# Modelo para Type
class Type(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='types', null=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, related_name='types', null=True)

    def __str__(self):
        return self.name

# Modelo para Brand
class Brand(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='brands', null=True)

    def __str__(self):
        return self.name

# Modelo para Product
class Product(models.Model):
    name = models.CharField(max_length=100)
    code = models.IntegerField(null=False, default=0, unique=True)
    type = models.ForeignKey(Type, on_delete=models.SET_NULL, related_name='products', null=True)
    description = models.TextField(null=True, blank=True)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, related_name='products', null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='products', null=True)
    
    @property
    def latest_stock(self):
        """Devuelve el último registro de stock para el producto."""
        from apps.stocks.models import Stock
        return Stock.objects.filter(product=self).order_by('-date').first()

# Modelo para WireProduct
class WireProduct(Product):
    number_coil = models.CharField(max_length=100)  # Número de bobina, campo obligatorio
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, related_name='products', null=True)
    initial_length = models.IntegerField(null=True, blank=True)  # Longitud inicial, opcional
    total_weight = models.FloatField(null=True, blank=True)  # Peso total, opcional
    coil_weight = models.FloatField(null=True, blank=True)  # Peso de la bobina, opcional
    technical_sheet_photo = models.ImageField(
        upload_to='products/{id}/',  # Ruta personalizada para incluir el ID
        null=True,
        blank=True
    )

    # Fechas independientes de creación, modificación y eliminación
    wire_created_at = models.DateTimeField(auto_now_add=True)
    wire_modified_at = models.DateTimeField(auto_now=True)
    wire_deleted_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        # Ajusta la ruta de carga para incluir el ID solo después de que el objeto tenga un ID
        if not self.pk:
            super(WireProduct, self).save(*args, **kwargs)
        self.technical_sheet_photo.field.upload_to = f'products/{self.id}/'
        super(WireProduct, self).save(*args, **kwargs)

    class Meta:
        verbose_name = "Wire Product"
        verbose_name_plural = "Wires Products"
