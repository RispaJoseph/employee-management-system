from rest_framework import serializers
from .models import Form, FormField


class FormFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormField
        fields = ['id','form', 'label', 'field_type', 'order']


class FormSerializer(serializers.ModelSerializer):
    fields = FormFieldSerializer(many=True, read_only=True)

    class Meta:
        model = Form
        fields = ['id', 'name', 'fields']

    def create(self, validated_data):
        request = self.context.get("request")
        validated_data["user"] = request.user
        return super().create(validated_data)
