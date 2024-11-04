from django.contrib import admin
from django.utils.safestring import mark_safe
from apps.products.models import Category, Type, Brand, Product, WireProduct

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

# Personalización del admin para Brand
@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'status', 'user')
    search_fields = ('name', 'description')
    ordering = ('name',)

# Personalización del admin para Product
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'category', 'type', 'created_at', 'deleted_at', 'user')
    list_filter = ('category', 'type', 'deleted_at')
    search_fields = ('name', 'code', 'description')
    ordering = ('name',)
    raw_id_fields = ('category', 'type')

# Personalización del admin para WireProduct
@admin.register(WireProduct)
class WireProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'category', 'type', 'brand', 'number_coil', 'initial_length', 
                    'total_weight', 'coil_weight', 'wire_created_at', 'wire_modified_at', 'wire_deleted_at', 'user', 'technical_sheet_photo_display')
    list_filter = ('category', 'type', 'brand', 'wire_deleted_at')
    search_fields = ('name', 'code', 'description', 'brand__name', 'number_coil')
    ordering = ('name',)
    raw_id_fields = ('category', 'type', 'brand')

    # Método para mostrar la imagen de la ficha técnica en el admin
    def technical_sheet_photo_display(self, obj):
        if obj.technical_sheet_photo:
            return mark_safe(f'<img src="{obj.technical_sheet_photo.url}" width="100" height="100" />')
        return "No Image"
    technical_sheet_photo_display.short_description = 'Ficha Técnica'

