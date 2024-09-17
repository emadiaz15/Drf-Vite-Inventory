from django.urls import path
from apps.cuts.api.views.cutting import cutting_orders_view, cutting_order_detail_view

urlpatterns = [
    path('orders/', cutting_orders_view, name='cutting_orders'),  # Debe coincidir con el nombre en los tests
    path('orders/<int:pk>/', cutting_order_detail_view, name='cutting_order_detail'),  # Este también
]
