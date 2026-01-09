from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import Employee
from .serializers import EmployeeCreateSerializer, EmployeeListSerializer


class EmployeeCreateView(generics.CreateAPIView):
    serializer_class = EmployeeCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        employee = serializer.save()

        response_serializer = EmployeeListSerializer(employee)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class EmployeeListView(generics.ListAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeListSerializer
    permission_classes = [permissions.IsAuthenticated]


class EmployeeDeleteView(generics.DestroyAPIView):
    queryset = Employee.objects.all()
    permission_classes = [permissions.IsAuthenticated]
