from django.contrib import admin
from apps.stocks.models import Stock

@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    """
    Configuración del panel de administración para el modelo Stock.
    """
    list_display = ('product', 'quantity', 'date', 'user')  # Columnas que se muestran en la lista de Stocks
    list_filter = ('product', 'date', 'user')  # Filtros laterales por producto, fecha y usuario
    search_fields = ('product__name', 'user__username')  # Campos que permiten búsqueda
    ordering = ('-date',)  # Orden por fecha descendente
    readonly_fields = ('date', 'modified_at')  # Campos que no se pueden editar directamente

    fieldsets = (
        (None, {
            'fields': ('product', 'quantity', 'user')
        }),
        ('Timestamps', {
            'fields': ('date', 'modified_at'),
        }),
    )

# Si no utilizas el decorador @admin.register, puedes registrar el modelo así:
# admin.site.register(Stock, StockAdmin)
