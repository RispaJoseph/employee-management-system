from rest_framework import generics, permissions
from django.db.models import Q
from rest_framework.response import Response
from rest_framework import status
from .models import Employee, EmployeeData
from .serializers import EmployeeCreateSerializer, EmployeeListSerializer, EmployeeUpdateSerializer


class EmployeeCreateView(generics.CreateAPIView):
    serializer_class = EmployeeCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        return {"request": self.request}

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        employee = serializer.save()

        response_serializer = EmployeeListSerializer(employee)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)



class EmployeeListView(generics.ListAPIView):
    serializer_class = EmployeeListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Employee.objects.filter(user=self.request.user)

        search = self.request.query_params.get("search")
        field_label = self.request.query_params.get("field")
        value = self.request.query_params.get("value")

        if search:
            queryset = queryset.filter(
                data__value__icontains=search
            )

        elif field_label and value:
            queryset = queryset.filter(
                data__field__label__icontains=field_label,
                data__value__icontains=value
            )

        return queryset.distinct()


class EmployeeUpdateView(generics.UpdateAPIView):
    serializer_class = EmployeeUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_url_kwarg = "pk"

    def get_queryset(self):
        return Employee.objects.filter(user=self.request.user)



class EmployeeDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Employee.objects.filter(user=self.request.user)

