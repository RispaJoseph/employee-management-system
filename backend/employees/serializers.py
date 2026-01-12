from rest_framework import serializers
from .models import Employee, EmployeeData


class EmployeeDataSerializer(serializers.ModelSerializer):
    field_label = serializers.CharField(source="field.label", read_only=True)
    class Meta:
        model = EmployeeData
        fields = ['field', 'field_label', 'value']


class EmployeeCreateSerializer(serializers.Serializer):
    form = serializers.IntegerField()
    data = EmployeeDataSerializer(many=True)

    def create(self, validated_data):
        from forms.models import Form
        request = self.context["request"]

        form = Form.objects.get(
            id=validated_data['form'],
            user=request.user   # 🔒 SECURITY
        )

        employee = Employee.objects.create(
            form=form,
            user=request.user
        )

        for item in validated_data['data']:
            EmployeeData.objects.create(
                employee=employee,
                field=item['field'],
                value=item['value']
            )

        return employee



class EmployeeListSerializer(serializers.ModelSerializer):
    data = EmployeeDataSerializer(many=True)

    class Meta:
        model = Employee
        fields = ['id', 'form', 'data', 'created_at']


class EmployeeUpdateSerializer(serializers.Serializer):
    data = EmployeeDataSerializer(many=True)

    def update(self, instance, validated_data):
        data = validated_data.get("data", [])

        for item in data:
            EmployeeData.objects.filter(
                employee=instance,
                field_id=item["field"]
            ).update(value=item["value"])

        return instance