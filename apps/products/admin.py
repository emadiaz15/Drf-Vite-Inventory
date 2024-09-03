from django.contrib import admin

from django.contrib import admin
from .models import Category, Type, Product, WireProduct, Comment, Stock

admin.site.register(Category)
admin.site.register(Type)
admin.site.register(Product)
admin.site.register(WireProduct)
admin.site.register(Comment)
admin.site.register(Stock)
