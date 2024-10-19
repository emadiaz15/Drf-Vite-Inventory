from rest_framework import serializers
from apps.stocks.models import Stock, StockHistory

class StockHistorySerializer(serializers.ModelSerializer):
    """
    Serializer para el historial de cambios en el stock.
    """
    class Meta:
        model = StockHistory
        fields = ['id', 'product', 'stock_before', 'stock_after', 'change_reason', 'recorded_at', 'user']


class StockSerializer(serializers.ModelSerializer):
    """
    Serializer para el stock, con la opción de incluir el historial de cambios.
    """
    stock_history = StockHistorySerializer(many=True, read_only=True)  # Incluye el historial de cambios

    class Meta:
        model = Stock
        fields = ['id', 'product', 'quantity', 'date', 'user', 'stock_history']  # Incluye el historial en los campos

