from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from ....models import Product
from apps.stocks.models import Stock
from ...serializers import ProductSerializer
from drf_spectacular.utils import extend_schema
import base64
from django.core.files.base import ContentFile

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
    responses={200: ProductSerializer, 400: "Bad Request - Invalid data"},
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
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({"detail": "Producto no encontrado."}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'PUT':
        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            product = serializer.save()

            # Manejo de la imagen de ficha técnica en `metadata` si está en Base64
            metadata = request.data.get('metadata', {})
            if 'technical_sheet_photo' in metadata:
                try:
                    format, imgstr = metadata['technical_sheet_photo'].split(';base64,')
                    ext = format.split('/')[-1]
                    product.image = ContentFile(base64.b64decode(imgstr), name=f"{product.name}_tech_sheet.{ext}")
                except Exception as e:
                    return Response({"detail": f"Error decoding technical sheet photo: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
            
            product.save()

            # Actualización de stock si se proporciona
            if 'stock_quantity' in request.data:
                stock, _ = Stock.objects.get_or_create(product=product, defaults={'user': request.user})
                stock.quantity = request.data['stock_quantity']
                stock.save()
                
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        Stock.objects.filter(product=product).delete()
        product.delete()
        return Response({"detail": "Producto y su stock eliminado correctamente."}, status=status.HTTP_204_NO_CONTENT)
