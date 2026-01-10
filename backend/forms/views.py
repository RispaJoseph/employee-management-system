from rest_framework import generics, permissions
from .models import Form, FormField
from .serializers import FormSerializer, FormFieldSerializer


class FormCreateListView(generics.ListCreateAPIView):
    serializer_class = FormSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Form.objects.filter(user=self.request.user)

    def get_serializer_context(self):
        return {"request": self.request}



class FormFieldCreateView(generics.CreateAPIView):
    queryset = FormField.objects.all()
    serializer_class = FormFieldSerializer
    permission_classes = [permissions.IsAuthenticated]
    
class FormDeleteAPIView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Form.objects.filter(user=self.request.user)


