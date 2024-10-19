from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from ...models import Type
from ..serializers import TypeSerializer
from drf_spectacular.utils import extend_schema

@extend_schema(
    methods=['GET'],
    operation_id="list_types",
    description="Retrieve a list of all types",
    responses={200: TypeSerializer(many=True)},
)
@extend_schema(
    methods=['POST'],
    operation_id="create_type",
    description="Create a new type",
    request=TypeSerializer,
    responses={
        201: TypeSerializer,
        400: "Bad Request - Invalid data",
    },
)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def type_list_create(request):
    """
    Endpoint para listar tipos o crear un nuevo tipo.
    """
    if request.method == 'GET':
        types = Type.objects.all()
        serializer = TypeSerializer(types, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        serializer = TypeSerializer(data=request.data)
        if serializer.is_valid():
            # Asociar el usuario autenticado si el modelo lo requiere
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    methods=['GET'],
    operation_id="retrieve_type",
    description="Retrieve details of a specific type",
    responses={200: TypeSerializer, 404: "Type not found"},
)
@extend_schema(
    methods=['PUT'],
    operation_id="update_type",
    description="Update details of a specific type",
    request=TypeSerializer,
    responses={
        200: TypeSerializer,
        400: "Bad Request - Invalid data",
    },
)
@extend_schema(
    methods=['DELETE'],
    operation_id="delete_type",
    description="Delete a specific type",
    responses={204: "Type deleted successfully", 404: "Type not found"},
)
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def type_detail(request, pk):
    """
    Endpoint para obtener, actualizar o eliminar un tipo específico.
    """
    try:
        type_instance = Type.objects.get(pk=pk)
    except Type.DoesNotExist:
        return Response({"detail": "Tipo no encontrado."}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = TypeSerializer(type_instance)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = TypeSerializer(type_instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        type_instance.delete()
        return Response({"detail": "Tipo eliminado correctamente."}, status=status.HTTP_204_NO_CONTENT)