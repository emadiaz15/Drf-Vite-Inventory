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
    category = CategorySerializer(read_only=True)
    type = TypeSerializer(read_only=True)
    user = serializers.StringRelatedField(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    # Extraer información de metadata si el producto es de tipo "Cables"
    brand = serializers.SerializerMethodField()
    number_coil = serializers.SerializerMethodField()
    initial_length = serializers.SerializerMethodField()
    total_weight = serializers.SerializerMethodField()
    coil_weight = serializers.SerializerMethodField()
    technical_sheet_photo = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['is_active']  # Impedir cambios directos en `is_active` a través del serializer

    def get_brand(self, obj):
        return obj.metadata.get("brand") if obj.metadata else None

    def get_number_coil(self, obj):
        return obj.metadata.get("number_coil") if obj.metadata else None

    def get_initial_length(self, obj):
        return obj.metadata.get("initial_length") if obj.metadata else None

    def get_total_weight(self, obj):
        return obj.metadata.get("total_weight") if obj.metadata else None

    def get_coil_weight(self, obj):
        return obj.metadata.get("coil_weight") if obj.metadata else None

    def get_technical_sheet_photo(self, obj):
        return obj.metadata.get("technical_sheet_photo") if obj.metadata else None

    def validate(self, data):
        category = data.get('category')
        if category and category.name == "Cables":
            metadata = data.get('metadata')
            required_fields = ['brand', 'number_coil', 'initial_length', 'total_weight', 'coil_weight', 'technical_sheet_photo']
            if not metadata:
                raise serializers.ValidationError("El campo 'metadata' es requerido para productos de tipo 'Cables'.")
            missing_fields = [field for field in required_fields if field not in metadata]
            if missing_fields:
                raise serializers.ValidationError(f"Faltan los siguientes campos en 'metadata': {', '.join(missing_fields)}")
        return data
