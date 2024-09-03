# apps/products/api/views/wire_product.py

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from ...models import WireProduct
from ..serializers import WireProductSerializer

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def wire_product_list_create(request):
    if request.method == 'GET':
        wire_products = WireProduct.objects.all()
        serializer = WireProductSerializer(wire_products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        serializer = WireProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def wire_product_detail(request, pk):
    try:
        wire_product = WireProduct.objects.get(pk=pk)
    except WireProduct.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = WireProductSerializer(wire_product)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = WireProductSerializer(wire_product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        wire_product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
