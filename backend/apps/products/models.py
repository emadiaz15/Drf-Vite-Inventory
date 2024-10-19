import qrcode
from io import BytesIO
from django.core.files import File
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Category model remains the same as before
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

class Type(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='types', null=True)

    # Relación con la categoría
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, related_name='types', null=True)

    def __str__(self):
        return self.name

class Brand(models.Model):
    name = models.CharField(max_length=200)  # Nombre de la marca
    description = models.TextField(null=True, blank=True)  # Descripción opcional
    status = models.BooleanField(default=True)  # Estado activo/inactivo
    created_at = models.DateTimeField(auto_now_add=True)  # Fecha de creación
    modified_at = models.DateTimeField(auto_now=True)  # Fecha de última modificación
    deleted_at = models.DateTimeField(null=True, blank=True)  # Fecha de eliminación (opcional)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='brands', null=True)  # Usuario relacionado (opcional)

    def __str__(self):
        return self.name  # Representación del objeto como su nombre

class Product(models.Model):
    name = models.CharField(max_length=100)
    code = models.IntegerField(null=False, default=0, unique=True)  # Código único
    type = models.ForeignKey(Type, on_delete=models.SET_NULL, related_name='products', null=True)
    description = models.TextField(null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, related_name='products', null=True)
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, related_name='products', null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='products', null=True)
    metadata = models.JSONField(default=dict, blank=True, null=True)  # Datos adicionales (JSON)
    image = models.ImageField(upload_to='products/', null=True, blank=True)  # Imagen del producto

    # Campo nuevo para almacenar el código QR generado
    qr_code = models.ImageField(upload_to='qr_codes/', null=True, blank=True)

    def __str__(self):
        return self.name

    # Lógica para generar el código QR
    def save(self, *args, **kwargs):
        # Generar código QR si no existe ya
        if not self.qr_code:
            self.generate_qr_code()
        super().save(*args, **kwargs)

    def generate_qr_code(self):
        """
        Genera un código QR basado en el nombre y el código del producto.
        """
        qr_content = f'{self.name} - {self.code}'  # Puedes cambiar esto a una URL u otro contenido
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(qr_content)
        qr.make(fit=True)

        # Guardar la imagen del código QR en memoria
        img = qr.make_image(fill='black', back_color='white')
        buffer = BytesIO()
        img.save(buffer)
        buffer.seek(0)

        # Guardar la imagen en el campo `qr_code`
        file_name = f'qr_code_{self.code}.png'
        self.qr_code.save(file_name, File(buffer), save=False)

    # Método existente para añadir metadata adicional
    def add_wire_metadata(self, number_coil, initial_length, total_weight):
        if not isinstance(number_coil, str):
            raise ValueError("number_coil debe ser una cadena de texto.")
        if not isinstance(initial_length, int) or initial_length < 0:
            raise ValueError("initial_length debe ser un entero positivo.")
        if not isinstance(total_weight, (int, float)) or total_weight < 0:
            raise ValueError("total_weight debe ser un número positivo.")

        self.metadata.update({
            'number_coil': number_coil,
            'initial_length': initial_length,
            'total_weight': total_weight,
        })
        self.save()

    @property
    def latest_stock(self):
        """Devuelve el último registro de stock para el producto."""
        from apps.stocks.models import Stock  # Importa el modelo Stock de la app 'stocks'
        return Stock.objects.filter(product=self).order_by('-date').first()
