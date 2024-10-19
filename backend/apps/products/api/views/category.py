from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from apps.products.models import Category
from ..serializers import CategorySerializer
from drf_spectacular.utils import extend_schema

@extend_schema(
    methods=['GET'],
    operation_id="list_categories",
    description="Retrieve a list of all categories",
    responses={200: CategorySerializer(many=True)},
)
@extend_schema(
    methods=['POST'],
    operation_id="create_category",
    description="Create a new category",
    request=CategorySerializer,
    responses={
        201: CategorySerializer,
        400: "Bad Request - Invalid data",
    },
)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def category_list_create(request):
    """
    Endpoint para obtener una lista de categorías o crear una nueva categoría.
    """
    if request.method == 'GET':
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            # Asociar la categoría con el usuario autenticado, si es necesario
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(
    methods=['GET'],
    operation_id="retrieve_category",
    description="Retrieve details of a specific category",
    responses={200: CategorySerializer, 404: "Category not found"},
)
@extend_schema(
    methods=['PUT'],
    operation_id="update_category",
    description="Update details of a specific category",
    request=CategorySerializer,
    responses={
        200: CategorySerializer,
        400: "Bad Request - Invalid data",
    },
)
@extend_schema(
    methods=['DELETE'],
    operation_id="delete_category",
    description="Delete a specific category",
    responses={204: "Category deleted successfully", 404: "Category not found"},
)
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def category_detail(request, pk):
    """
    Endpoint para obtener, actualizar o eliminar una categoría específica.
    """
    try:
        category = Category.objects.get(pk=pk)
    except Category.DoesNotExist:
        return Response({"detail": "Categoría no encontrada."}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = CategorySerializer(category)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = CategorySerializer(category, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        category.delete()
        return Response({"detail": "Categoría eliminada correctamente."}, status=status.HTTP_204_NO_CONTENT)