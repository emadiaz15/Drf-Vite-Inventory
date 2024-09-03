from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

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

    # Manager para filtrar categorías no eliminadas
    objects = models.Manager()  # Manager por defecto
    active_objects = models.Manager.from_queryset(Category.objects.filter(deleted_at__isnull=True))  # Manager custom

class Type(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='types', null=True)

    def __str__(self):
        return self.name

    # Manager para filtrar tipos no eliminados
    objects = models.Manager()
    active_objects = models.Manager.from_queryset(Type.objects.filter(deleted_at__isnull=True))

class Product(models.Model):
    name = models.CharField(max_length=100)
    code = models.IntegerField(null=False, default=0, unique=True)  # Hacer que el código sea único
    type = models.ForeignKey(Type, on_delete=models.SET_NULL, related_name='products', null=True)
    description = models.TextField(null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, related_name='products', null=True)
    brand = models.CharField(max_length=200)  # marca
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='products', null=True)
    metadata = models.JSONField(default=dict, blank=True, null=True)  # Campo JSON para datos adicionales
    image = models.ImageField(upload_to='products/', null=True, blank=True)  # Nuevo campo para la imagen del producto

    def __str__(self):
        return self.name

    # Manager para filtrar productos no eliminados
    objects = models.Manager()
    active_objects = models.Manager.from_queryset(Product.objects.filter(deleted_at__isnull=True))

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

class Comment(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='comments', null=True)
    text = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f'Comment by {self.user.username} for {self.product.name}'

    # Manager para filtrar comentarios no eliminados
    objects = models.Manager()
    active_objects = models.Manager.from_queryset(Comment.objects.filter(deleted_at__isnull=True))

class Stock(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='inventory')
    quantity = models.DecimalField(max_digits=15, decimal_places=2)
    date = models.DateTimeField(auto_now=True)
    modified_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f'Inventory for {self.product.name} on {self.date}'
