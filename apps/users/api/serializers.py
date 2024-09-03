from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from apps.users.models import User

class UserSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo User.
    Maneja la conversión de los datos del modelo User a formato JSON y viceversa.
    """
    class Meta:
        model = User
        fields = '__all__'  # Cambiar a una lista explícita de campos si es necesario
        extra_kwargs = {
            'email': {'required': True},
            'username': {'required': True},
        }

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Serializador personalizado para obtener pares de tokens JWT.
    Añade claims personalizados al token, como el nombre y el email del usuario.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Añadir claims personalizados
        token['name'] = user.name
        token['email'] = user.email

        return token
