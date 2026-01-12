from django.urls import path
from .views import EmployeeCreateView, EmployeeListView, EmployeeDeleteView, EmployeeUpdateView

urlpatterns = [
    path('', EmployeeListView.as_view()),
    path('create/', EmployeeCreateView.as_view()),
    path('<int:pk>/delete/', EmployeeDeleteView.as_view()),
    path("<int:pk>/update/", EmployeeUpdateView.as_view()),

]
