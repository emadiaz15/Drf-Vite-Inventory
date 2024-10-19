from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from apps.products.api.views.category import category_list_create, category_detail
from apps.products.api.views.type import type_list_create, type_detail
from apps.products.api.views.product import product_list_create, product_detail

urlpatterns = [
    # Rutas de Categorías
    path('categories/', category_list_create, name='category-list-create'),
    path('categories/<int:pk>/', category_detail, name='category-detail'),

    # Rutas de Tipos
    path('types/', type_list_create, name='type-list-create'),
    path('types/<int:pk>/', type_detail, name='type-detail'),

    # Rutas de Productos
    path('list/', product_list_create, name='product-list-create'),
    path('products/<int:pk>/', product_detail, name='product-detail'),

    # Rutas para Código QR de productos
]

# Añadir soporte para sufijos de formatos (e.g., /products.json)
urlpatterns = format_suffix_patterns(urlpatterns)
