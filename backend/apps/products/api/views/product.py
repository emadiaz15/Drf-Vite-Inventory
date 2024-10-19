from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from ...models import Product
from apps.stocks.models import Stock  # Importamos el modelo Stock para gestionar el stock
from ..serializers import ProductSerializer
from apps.stocks.api.serializers import StockSerializer  # Serializer de Stock
from drf_spectacular.utils import extend_schema

@extend_schema(
    methods=['GET'],
    operation_id="list_products",
    description="Retrieve a list of all products or filter by category or type",
    parameters=[
        {
            'name': 'category',
            'in': 'query',
            'description': 'Filter products by category ID',
            'required': False,
            'schema': {'type': 'integer'}
        },
        {
            'name': 'type',
            'in': 'query',
            'description': 'Filter products by type ID',
            'required': False,
            'schema': {'type': 'integer'}
        }
    ],
    responses={200: ProductSerializer(many=True)},
)
@extend_schema(
    methods=['POST'],
    operation_id="create_product",
    description="Create a new product and optionally set initial stock",
    request=ProductSerializer,
    responses={
        201: ProductSerializer,
        400: "Bad Request - Invalid data",
    },
)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def product_list_create(request):
    """
    Endpoint para listar productos o crear un nuevo producto.
    Se puede filtrar por categoría o tipo usando parámetros de consulta.
    """
    if request.method == 'GET':
        # Filtrar productos por categoría o tipo si se pasan como parámetros
        category_id = request.query_params.get('category')
        type_id = request.query_params.get('type')
        
        if category_id:
            products = Product.objects.filter(category_id=category_id)
        elif type_id:
            products = Product.objects.filter(type_id=type_id)
        else:
            products = Product.objects.all()
        
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            # Asociar el producto al usuario autenticado
            product = serializer.save(user=request.user)

            # Iniciar el stock si se pasa en la solicitud
            if 'stock_quantity' in request.data:
                Stock.objects.create(
                    product=product,
                    quantity=request.data['stock_quantity'],
                    user=request.user
                )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(
    methods=['GET'],
    operation_id="retrieve_product",
    description="Retrieve details of a specific product, including its stock",
    responses={200: ProductSerializer, 404: "Product not found"},
)
@extend_schema(
    methods=['PUT'],
    operation_id="update_product",
    description="Update details of a specific product and optionally update stock",
    request=ProductSerializer,
    responses={
        200: ProductSerializer,
        400: "Bad Request - Invalid data",
    },
)
@extend_schema(
    methods=['DELETE'],
    operation_id="delete_product",
    description="Delete a specific product and its associated stock",
    responses={204: "Product deleted successfully", 404: "Product not found"},
)
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def product_detail(request, pk):
    """
    Endpoint para obtener, actualizar o eliminar un producto específico.
    Incluye la gestión del stock al actualizar o eliminar.
    """
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({"detail": "Producto no encontrado."}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = ProductSerializer(product)
        # También obtenemos el stock asociado al producto
        stock = Stock.objects.filter(product=product).first()
        stock_serializer = StockSerializer(stock) if stock else None
        response_data = serializer.data
        if stock_serializer:
            response_data['stock'] = stock_serializer.data  # Añadimos el stock al detalle del producto
        return Response(response_data, status=status.HTTP_200_OK)
    
    elif request.method == 'PUT':
        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            product = serializer.save()

            # Actualizamos el stock si se incluye en la solicitud
            if 'stock_quantity' in request.data:
                stock, created = Stock.objects.get_or_create(product=product, defaults={'user': request.user})
                stock.quantity = request.data['stock_quantity']
                stock.save()

            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        # Eliminar el producto y su stock asociado
        stock = Stock.objects.filter(product=product)
        stock.delete()  # Eliminamos el stock asociado
        product.delete()  # Eliminamos el producto
        return Response({"detail": "Producto y su stock eliminado correctamente."}, status=status.HTTP_204_NO_CONTENT)
