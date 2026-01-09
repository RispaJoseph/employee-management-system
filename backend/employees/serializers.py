from rest_framework import serializers
from .models import Employee, EmployeeData


class EmployeeDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeData
        fields = ['field', 'value']


class EmployeeCreateSerializer(serializers.Serializer):
    form = serializers.IntegerField()
    data = EmployeeDataSerializer(many=True)

    def create(self, validated_data):
        from forms.models import Form

        form = Form.objects.get(id=validated_data['form'])
        employee = Employee.objects.create(form=form)

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
