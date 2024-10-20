from rest_framework import serializers
from ..models import Category, Type, Product
from apps.comments.api.serializers import CommentSerializer  # Importamos el serializer de comentarios

# Serializer para Category
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

# Serializer para Type
class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = '__all__'

# Serializer para Product con relaciones
class ProductSerializer(serializers.ModelSerializer):
    # Serializamos las relaciones con Category y Type
    category = CategorySerializer(read_only=True)  # Si deseas permitir escritura, debes usar PrimaryKeyRelatedField
    type = TypeSerializer(read_only=True)
    user = serializers.StringRelatedField(read_only=True)  # Si solo quieres mostrar el username del usuario
    comments = CommentSerializer(many=True, read_only=True)  # Incluir los comentarios asociados al producto

    class Meta:
        model = Product
        fields = '__all__'  # Incluimos todos los campos, incluidos los comentarios

    # Si deseas permitir crear o actualizar productos usando solo el ID de las relaciones
    def create(self, validated_data):
        # Puedes manejar las relaciones a través de sus IDs aquí, si es necesario
        return super().create(validated_data)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
