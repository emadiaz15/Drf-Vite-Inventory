from rest_framework import serializers
from apps.stocks.models import Stock

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ['id', 'product', 'quantity', 'date', 'user']
