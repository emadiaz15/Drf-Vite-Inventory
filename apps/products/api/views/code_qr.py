import os
from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from apps.products.models import Product

@api_view(['GET'])
def generate_qr_code_view(request, product_id):
    """
    Genera el código QR para un producto específico y devuelve la URL del QR generado.
    Si el código QR ya ha sido generado, simplemente devuelve la URL existente.
    """
    # Verificar si el usuario está autenticado
    if not request.user.is_authenticated:
        return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)

    product = get_object_or_404(Product, id=product_id)
    
    # Si el código QR ya ha sido generado, no lo volvemos a generar.
    if not product.qr_code:
        product.generate_qr_code()

    return Response({'qr_code_url': product.qr_code.url}, status=status.HTTP_200_OK)


@api_view(['GET'])
def show_qr_code_image(request, product_id):
    """
    Muestra el código QR generado para el producto.
    Devuelve un error si el código QR no ha sido generado o si el archivo no se encuentra.
    """
    # Verificar si el usuario está autenticado
    if not request.user.is_authenticated:
        return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)

    product = get_object_or_404(Product, id=product_id)

    # Asegurarse de que el producto tenga un código QR generado
    if not product.qr_code:
        return Response({'detail': 'El código QR no ha sido generado.'}, status=status.HTTP_404_NOT_FOUND)
    
    # Construir la ruta completa del archivo de código QR
    qr_code_path = os.path.join(settings.MEDIA_ROOT, str(product.qr_code))

    # Verificar si el archivo existe
    if not os.path.exists(qr_code_path):
        return Response({'detail': 'Archivo de código QR no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    # Enviar el archivo de imagen como respuesta HTTP
    with open(qr_code_path, "rb") as qr_file:
        return HttpResponse(qr_file.read(), content_type="image/png")
