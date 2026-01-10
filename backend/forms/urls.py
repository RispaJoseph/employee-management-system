from django.urls import path
from .views import FormCreateListView, FormFieldCreateView, FormDeleteAPIView

urlpatterns = [
    path('', FormCreateListView.as_view()),
    path('fields/', FormFieldCreateView.as_view()),
    path('<int:pk>/delete/', FormDeleteAPIView.as_view(), name='form-delete'),
]
