from django.contrib import admin
from apps.comments.models import Comment

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'product', 'user', 'text', 'created_at', 'deleted_at')
    list_filter = ('deleted_at', 'created_at')
    search_fields = ('text', 'user__username', 'product__name')
    readonly_fields = ('created_at', 'modified_at')
