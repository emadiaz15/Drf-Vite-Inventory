from django.urls import path
from apps.products.api.views.category import category_list_create, category_detail
from apps.products.api.views.type import type_list_create, type_detail
from apps.products.api.views.product import product_list_create, product_detail
from apps.products.api.views.wire_product import wire_product_list_create, wire_product_detail
from apps.products.api.views.comment import comment_list_create, comment_detail
from apps.products.api.views.stock import stock_list_create, stock_detail

urlpatterns = [
    path('categories/', category_list_create, name='category-list-create'),
    path('categories/<int:pk>/', category_detail, name='category-detail'),
    path('types/', type_list_create, name='type-list-create'),
    path('types/<int:pk>/', type_detail, name='type-detail'),
    path('products/', product_list_create, name='product-list-create'),
    path('products/<int:pk>/', product_detail, name='product-detail'),
    path('wireproducts/', wire_product_list_create, name='wireproduct-list-create'),
    path('wireproducts/<int:pk>/', wire_product_detail, name='wireproduct-detail'),
    path('comments/', comment_list_create, name='comment-list-create'),
    path('comments/<int:pk>/', comment_detail, name='comment-detail'),
    path('stocks/', stock_list_create, name='stock-list-create'),
    path('stocks/<int:pk>/', stock_detail, name='stock-detail'),
]
