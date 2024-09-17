from django.urls import path
from apps.stocks.api.views.stock import list_stocks_view

urlpatterns = [
    path('stocks/', list_stocks_view, name='list_stocks'),
]
