from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from ....models import Product
from apps.stocks.models import Stock
from ...serializers import ProductSerializer
from drf_spectacular.utils import extend_schema
from ....pagination import ProductPagination

@extend_schema(
    methods=['GET'],
    operation_id="list_products",
    description="Retrieve a list of all products or filter by category or type",
    parameters=[
        {'name': 'category', 'in': 'query', 'description': 'Filter products by category ID', 'required': False, 'schema': {'type': 'integer'}},
        {'name': 'type', 'in': 'query', 'description': 'Filter products by type ID', 'required': False, 'schema': {'type': 'integer'}}
    ],
    responses={200: ProductSerializer(many=True)},
)
@extend_schema(
    methods=['POST'],
    operation_id="create_product",
    description="Create a new product and optionally set initial stock",
    request=ProductSerializer,
    responses={201: ProductSerializer, 400: "Bad Request - Invalid data"},
)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def product_list(request):
    if request.method == 'GET':
        category_id = request.query_params.get('category')
        type_id = request.query_params.get('type')

        products = Product.objects.all()
        if category_id:
            products = products.filter(category_id=category_id)
        if type_id:
            products = products.filter(type_id=type_id)
        
        # Usar el paginador personalizado
        paginator = ProductPagination()
        paginated_products = paginator.paginate_queryset(products, request)
        serializer = ProductSerializer(paginated_products, many=True)
        
        # Devuelve la respuesta paginada
        return paginator.get_paginated_response(serializer.data)
    
    elif request.method == 'POST':
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            product = serializer.save(user=request.user)
            if 'stock_quantity' in request.data:
                Stock.objects.create(product=product, quantity=request.data['stock_quantity'], user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
