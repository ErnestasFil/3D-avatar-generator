from django.urls import path

from .views import ProjectSelectDeleteView, ProjectListCreateView

urlpatterns = [
    path("project", ProjectListCreateView.as_view(), name="project_list_create_view"),
    path("project/<int:project_id>", ProjectSelectDeleteView.as_view(), name="project_delete_view"),
]
