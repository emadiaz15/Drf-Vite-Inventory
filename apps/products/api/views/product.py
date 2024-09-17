from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from ...models import Product
from ..serializers import ProductSerializer
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
    description="Create a new product",
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
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(
    methods=['GET'],
    operation_id="retrieve_product",
    description="Retrieve details of a specific product",
    responses={200: ProductSerializer, 404: "Product not found"},
)
@extend_schema(
    methods=['PUT'],
    operation_id="update_product",
    description="Update details of a specific product",
    request=ProductSerializer,
    responses={
        200: ProductSerializer,
        400: "Bad Request - Invalid data",
    },
)
@extend_schema(
    methods=['DELETE'],
    operation_id="delete_product",
    description="Delete a specific product",
    responses={204: "Product deleted successfully", 404: "Product not found"},
)
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def product_detail(request, pk):
    """
    Endpoint para obtener, actualizar o eliminar un producto específico.
    """
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({"detail": "Producto no encontrado."}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        product.delete()
        return Response({"detail": "Producto eliminado correctamente."}, status=status.HTTP_204_NO_CONTENT)
