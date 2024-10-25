from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from apps.products.api.views.category import category_list, category_detail
from apps.products.api.views.type import type_list, type_detail
from apps.products.api.views.products.product_list import product_list
from apps.products.api.views.products.product_detail import product_detail

urlpatterns = [
    # Rutas de Categorías
    path('categories/', category_list, name='category-list'),
    path('categories/<int:pk>/', category_detail, name='category-detail'),

    # Rutas de Tipos
    path('types/', type_list, name='type-list'),
    path('types/<int:pk>/', type_detail, name='type-detail'),

    # Rutas de Productos
    path('list/', product_list, name='product-list'),
    path('products/<int:pk>/', product_detail, name='product-detail'),

    # Rutas para Código QR de productos
]

# Añadir soporte para sufijos de formatos (e.g., /products.json)
urlpatterns = format_suffix_patterns(urlpatterns)
