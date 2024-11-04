
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from ....models import WireProduct
from apps.stocks.models import Stock
from ...serializers import WireProductSerializer
from drf_spectacular.utils import extend_schema
from ....pagination import ProductPagination

@extend_schema(
    methods=['GET'],
    operation_id="wire_product_list",
    description="Retrieve a list of all wire products or filter by category or brand",
    parameters=[
        {'name': 'category', 'in': 'query', 'description': 'Filter wire products by category ID', 'required': False, 'schema': {'type': 'integer'}},
        {'name': 'brand', 'in': 'query', 'description': 'Filter wire products by brand ID', 'required': False, 'schema': {'type': 'integer'}}
    ],
    responses={200: WireProductSerializer(many=True)},
)
@extend_schema(
    methods=['POST'],
    operation_id="create_wire_product",
    description="Create a new wire product and optionally set initial stock",
    request=WireProductSerializer,
    responses={201: WireProductSerializer, 400: "Bad Request - Invalid data"},
)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def wire_product_list(request):
    if request.method == 'GET':
        category_id = request.query_params.get('category')
        brand_id = request.query_params.get('brand')

        wire_products = WireProduct.objects.all()
        if category_id:
            wire_products = wire_products.filter(category_id=category_id)
        if brand_id:
            wire_products = wire_products.filter(brand_id=brand_id)
        
        paginator = ProductPagination()
        paginated_wire_products = paginator.paginate_queryset(wire_products, request)
        serializer = WireProductSerializer(paginated_wire_products, many=True)
        
        return paginator.get_paginated_response(serializer.data)
    
    elif request.method == 'POST':
        serializer = WireProductSerializer(data=request.data)
        if serializer.is_valid():
            wire_product = serializer.save(user=request.user)
            if 'stock_quantity' in request.data:
                Stock.objects.create(product=wire_product, quantity=request.data['stock_quantity'], user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)