from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from apps.products.api.views.category import category_list_create, category_detail
from apps.products.api.views.type import type_list_create, type_detail
from apps.products.api.views.product import product_list_create, product_detail
from apps.products.api.views.code_qr import generate_qr_code_view, show_qr_code_image  # Asegúrate de que estas vistas estén aquí

urlpatterns = [
    # Rutas de Categorías
    path('categories/', category_list_create, name='category-list-create'),
    path('categories/<int:pk>/', category_detail, name='category-detail'),

    # Rutas de Tipos
    path('types/', type_list_create, name='type-list-create'),
    path('types/<int:pk>/', type_detail, name='type-detail'),

    # Rutas de Productos
    path('products/', product_list_create, name='product-list-create'),
    path('products/<int:pk>/', product_detail, name='product-detail'),

    # Rutas para Código QR de productos
    path('products/<int:product_id>/generate-qr/', generate_qr_code_view, name='generate_qr_code'),
    path('products/<int:product_id>/show-qr/', show_qr_code_image, name='show_qr_code_image'),
]

# Añadir soporte para sufijos de formatos (e.g., /products.json)
urlpatterns = format_suffix_patterns(urlpatterns)
