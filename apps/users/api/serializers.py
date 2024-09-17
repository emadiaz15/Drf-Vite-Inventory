from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from apps.users.models import User

class UserSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo User.
    Maneja la conversión de los datos del modelo User a formato JSON y viceversa.
    """
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'last_name', 'dni', 'image', 'is_active', 'is_staff', 'password']
        extra_kwargs = {
            'email': {'required': True},
            'username': {'required': True},
        }

    def create(self, validated_data):
        # Para crear el usuario con una contraseña encriptada
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)  # Encriptar la contraseña
        user.save()
        return user

    def update(self, instance, validated_data):
        # Para actualizar un usuario con encriptación de la contraseña si es necesario
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


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
        # Puedes agregar más campos personalizados si lo necesitas
        # token['dni'] = user.dni

        return token
