import base64
from django.core.files.base import ContentFile
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Product(models.Model):
    name = models.CharField(max_length=100)
    code = models.IntegerField(null=False, default=0, unique=True)
    type = models.ForeignKey('Type', on_delete=models.SET_NULL, related_name='products', null=True)
    description = models.TextField(null=True, blank=True)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    category = models.ForeignKey('Category', on_delete=models.SET_NULL, related_name='products', null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='products', null=True)
    metadata = models.JSONField(null=True, blank=True)
    is_active = models.BooleanField(default=True)  # Nuevo campo para el estado activo/inactivo

    @property
    def latest_stock(self):
        from apps.stocks.models import Stock
        return Stock.objects.filter(product=self).order_by('-date').first()

    def save(self, *args, **kwargs):
        # Validación de metadata si la categoría es "Cables"
        if self.category and self.category.name == "Cables":
            required_fields = ['brand', 'number_coil', 'initial_length', 'total_weight', 'coil_weight', 'technical_sheet_photo']
            if not self.metadata or any(field not in self.metadata for field in required_fields):
                raise ValueError("Los productos de tipo 'Cables' requieren datos adicionales en el campo 'metadata'.")

            technical_sheet_photo_base64 = self.metadata.get("technical_sheet_photo")
            if technical_sheet_photo_base64:
                try:
                    format, imgstr = technical_sheet_photo_base64.split(';base64,')
                    ext = format.split('/')[-1]
                    self.image = ContentFile(base64.b64decode(imgstr), name=f"{self.name}_tech_sheet.{ext}")
                except Exception as e:
                    raise ValueError("Error al decodificar la imagen de la ficha técnica en 'metadata': " + str(e))

        super(Product, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        """Marca el producto como inactivo en lugar de eliminarlo."""
        self.is_active = False
        self.deleted_at = models.DateTimeField(auto_now=True)
        self.save()

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='categories', null=True)
    is_active = models.BooleanField(default=True)  # Nuevo campo para el estado activo/inactivo

    def delete(self, *args, **kwargs):
        """Marca la categoría como inactiva en lugar de eliminarla."""
        self.is_active = False
        self.deleted_at = models.DateTimeField(auto_now=True)
        self.save()

    def __str__(self):
        return self.name


class Type(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='types', null=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, related_name='types', null=True)
    is_active = models.BooleanField(default=True)  # Nuevo campo para el estado activo/inactivo

    def delete(self, *args, **kwargs):
        """Marca el tipo como inactivo en lugar de eliminarlo."""
        self.is_active = False
        self.deleted_at = models.DateTimeField(auto_now=True)
        self.save()

    def __str__(self):
        return self.name
