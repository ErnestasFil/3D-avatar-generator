from django.urls import path

from .views import ImageDeleteView, ImageListCreateView

urlpatterns = [
    path("image", ImageListCreateView.as_view(), name="image_list_create_view"),
    path("image/<int:image_id>", ImageDeleteView.as_view(), name="image_delete_view"),
]
