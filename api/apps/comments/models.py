from django.utils.timezone import now
from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

User = get_user_model()

# Manager personalizado para manejar solo los comentarios activos
class ActiveCommentManager(models.Manager):
    def get_queryset(self):
        # Retorna solo los comentarios que no han sido "eliminados" (soft delete)
        return super().get_queryset().filter(deleted_at__isnull=True)

class Comment(models.Model):
    # Relación genérica para permitir comentarios en Product o SubProduct
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    user = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='comments', null=True)
    text = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)  # Campo para soft delete

    def __str__(self):
        return f'Comment by {self.user.username} on {self.content_object}'

    # Manager para obtener solo los comentarios no eliminados
    objects = models.Manager()  # Manager por defecto
    active_objects = ActiveCommentManager()  # Manager para comentarios activos

    def delete(self, *args, **kwargs):
        """
        Realiza una eliminación suave: en lugar de eliminar el registro, establece deleted_at con la fecha y hora actual.
        """
        self.deleted_at = now()  # Marca el comentario como eliminado
        self.save(update_fields=['deleted_at'])  # Guarda solo el campo `deleted_at`

    def restore(self):
        """
        Restaura el comentario eliminado, estableciendo `deleted_at` a None.
        """
        self.deleted_at = None
        self.save(update_fields=['deleted_at'])  # Guarda solo el campo `deleted_at` para restaurar

    class Meta:
        ordering = ['-created_at']  # Ordena por fecha de creación descendente
