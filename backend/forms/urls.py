from django.urls import path
from .views import FormCreateListView, FormFieldCreateView

urlpatterns = [
    path('', FormCreateListView.as_view()),
    path('fields/', FormFieldCreateView.as_view()),
]
