from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from apps.users.models import User
from ..serializers import UserSerializer, CustomTokenObtainPairSerializer
from drf_spectacular.utils import extend_schema, extend_schema_view

@extend_schema(
    operation_id="home_view",
    description="Home view that returns a welcome message",
    responses={200: {"application/json": {"message": "¡Bienvenido!"}}},
)
@api_view(['GET'])
def home_view(request):
    return Response({"message": "¡Bienvenido!"})

@extend_schema(
    operation_id="register_view",
    description="Register a new user",
    request=UserSerializer,
    responses={
        201: UserSerializer,
        400: "Bad Request - Invalid data",
    },
)
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            "user": UserSerializer(user).data,
            "message": "User created successfully. Now perform login to get your token.",
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema_view(
    post=extend_schema(
        operation_id="obtain_jwt_token_pair",
        description="Obtain JWT token pair (access and refresh)",
        request=CustomTokenObtainPairSerializer,
        responses={200: "JWT Token"},
    )
)
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
