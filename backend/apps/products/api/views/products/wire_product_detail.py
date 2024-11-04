
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from ....models import WireProduct
from ...serializers import WireProductSerializer
from drf_spectacular.utils import extend_schema

@extend_schema(
    methods=['GET'],
    operation_id="retrieve_wire_product",
    description="Retrieve the details of a wire product",
    responses={200: WireProductSerializer},
)
@extend_schema(
    methods=['PUT'],
    operation_id="update_wire_product",
    description="Update an existing wire product",
    request=WireProductSerializer,
    responses={200: WireProductSerializer, 400: "Bad Request - Invalid data"},
)
@extend_schema(
    methods=['DELETE'],
    operation_id="delete_wire_product",
    description="Delete a wire product",
    responses={204: None},
)
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def wire_product_detail(request, pk):
    try:
        wire_product = WireProduct.objects.get(pk=pk)
    except WireProduct.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

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