from rest_framework import serializers
from apps.comments.models import Comment

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'product', 'user', 'text', 'created_at', 'modified_at', 'deleted_at']
        read_only_fields = ['id', 'created_at', 'modified_at', 'deleted_at']

    def validate(self, data):
        # Puedes agregar validaciones personalizadas si es necesario
        if not data.get('text'):
            raise serializers.ValidationError("Comment text cannot be empty.")
        return data
