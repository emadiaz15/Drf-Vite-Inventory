from django.utils.timezone import now
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Manager personalizado para manejar solo los comentarios activos
class ActiveCommentManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(deleted_at__isnull=True)

class Comment(models.Model):
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='comments', null=True)
    text = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)  # Campo para soft delete

    def __str__(self):
        return f'Comment by {self.user.username} for {self.product.name}'

    # Manager para obtener solo los comentarios no eliminados
    objects = models.Manager()  # Manager por defecto
    active_objects = ActiveCommentManager()  # Manager para comentarios activos

    def delete(self, soft=False, *args, **kwargs):
        if soft:
            self.deleted_at = now()  # Asigna un valor de `datetime` válido
            self.save()
        else:
            super().delete(*args, **kwargs)