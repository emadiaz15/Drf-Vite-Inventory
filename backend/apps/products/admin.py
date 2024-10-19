from django.contrib import admin
from apps.products.models import Category, Type, Product, Brand

from django.utils.safestring import mark_safe

# Personalización del admin para Category
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'status', 'created_at', 'deleted_at', 'user')
    list_filter = ('status', 'deleted_at')
    search_fields = ('name', 'description')
    ordering = ('name',)

# Personalización del admin para Type
@admin.register(Type)
class TypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'status', 'created_at', 'deleted_at', 'user')
    list_filter = ('status', 'deleted_at')
    search_fields = ('name', 'description')
    ordering = ('name',)

# Personalización del admin para Product, incluyendo el QR Code
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'category', 'type', 'brand', 'created_at', 'deleted_at', 'user', 'qr_code_image')
    list_filter = ('category', 'type', 'brand', 'deleted_at')
    search_fields = ('name', 'code', 'description', 'brand')
    ordering = ('name',)
    raw_id_fields = ('category', 'type')  # Para mostrar un selector de ID en lugar del completo en relaciones

    # Método para mostrar la imagen del QR Code en la lista de productos
    def qr_code_image(self, obj):
        if obj.qr_code:
            return mark_safe(f'<img src="{obj.qr_code.url}" width="100" height="100" />')
        return "No QR Code"
    qr_code_image.short_description = 'QR Code'

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'status', 'user')
    search_fields = ('name', 'description')
    ordering = ('name',)
