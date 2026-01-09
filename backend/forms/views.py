from rest_framework import generics, permissions
from .models import Form, FormField
from .serializers import FormSerializer, FormFieldSerializer


class FormCreateListView(generics.ListCreateAPIView):
    queryset = Form.objects.all()
    serializer_class = FormSerializer
    permission_classes = [permissions.IsAuthenticated]


class FormFieldCreateView(generics.CreateAPIView):
    queryset = FormField.objects.all()
    serializer_class = FormFieldSerializer
    permission_classes = [permissions.IsAuthenticated]
